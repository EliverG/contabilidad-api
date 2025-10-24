import { AppDataSource } from "../data-source";
import { CierreContable } from "../entities/cierreContable";
import { CierreContableRepository } from "../repositories/cierreContableRepository";

export class CierreContableService {
  private cierreContableRepository = new CierreContableRepository();

  async getAll(): Promise<CierreContable[]> {
    return await this.cierreContableRepository.findAll();
  }

  async getById(id: number): Promise<CierreContable | null> {
    return await this.cierreContableRepository.findById(id);
  }

  async create(data: CierreContable): Promise<CierreContable> {
    return await this.cierreContableRepository.save(data);
  }

  async remove(id: number): Promise<boolean> {
    return await this.cierreContableRepository.remove(id);
  }

  async update(id: number, data: Partial<CierreContable>): Promise<CierreContable | null> {
    return await this.cierreContableRepository.update(id, data);
  }

  // ============== NUEVO: Validación ==============
  async validatePeriodo(idPeriodo: number) {
    const manager = AppDataSource.manager;

    const periodo = await manager.query(
      `SELECT id_periodo, estado, fecha_inicio, fecha_fin
         FROM CONTABILIDAD.PERIODO_CONTABLE
        WHERE id_periodo = :id`,
      [idPeriodo]
    );
    const period = periodo[0];
    const errores: string[] = [];
    if (!period) errores.push("El período no existe.");
    if (period?.ESTADO && period.ESTADO !== "ABIERTO") errores.push("El período no está ABIERTO.");

    const cierreExistente = await manager.query(
      `SELECT COUNT(1) as CNT
         FROM CONTABILIDAD.CIERRE_CONTABLE
        WHERE id_periodo = :id`,
      [idPeriodo]
    );
    if (Number(cierreExistente?.[0]?.CNT || 0) > 0) {
      errores.push("Ya existe un cierre para este período.");
    }

    const totales = await manager.query(
      `SELECT NVL(SUM(total_debito),0) as DEBITO, NVL(SUM(total_credito),0) as CREDITO
         FROM CONTABILIDAD.ASIENTO_CONTABLE
        WHERE id_periodo = :id`,
      [idPeriodo]
    );
    const debito = Number(totales?.[0]?.DEBITO || 0);
    const credito = Number(totales?.[0]?.CREDITO || 0);
    if (debito !== credito) {
      errores.push(`Descuadre en asientos contabilizados. Débito=${debito} Crédito=${credito}`);
    }

    return {
      valido: errores.length === 0,
      errores,
      totales: { debito, credito },
    };
  }

  // ============== NUEVO: Previsualización ==============
  async previsualizar(idPeriodo: number) {
    const manager = AppDataSource.manager;

    const porTipo = await manager.query(
      `SELECT c.tipo as TIPO,
              NVL(SUM(d.debito),0) as DEBITO,
              NVL(SUM(d.credito),0) as CREDITO
         FROM CONTABILIDAD.DETALLE_ASIENTO d
         JOIN CONTABILIDAD.ASIENTO_CONTABLE a ON a.id_asiento = d.id_asiento
         JOIN CONTABILIDAD.CUENTA_CONTABLE c ON c.id_cuenta = d.id_cuenta
        WHERE a.id_periodo = :id
        GROUP BY c.tipo`,
      [idPeriodo]
    );

    const map = new Map<string, { debito: number; credito: number }>();
    porTipo.forEach((r: any) => {
      map.set(r.TIPO, { debito: Number(r.DEBITO), credito: Number(r.CREDITO) });
    });

    const ingresos = (map.get("INGRESO")?.credito || 0) - (map.get("INGRESO")?.debito || 0);
    const gastos = (map.get("GASTO")?.debito || 0) - (map.get("GASTO")?.credito || 0);
    const resultado = ingresos - gastos;

    return {
      resumen: { ingresos, gastos, resultado },
      detallePorTipo: Object.fromEntries([...map.entries()]),
    };
  }

  // ============== NUEVO: Cerrar período ==============
  async cerrar(opts: { idPeriodo: number; idUsuario: number; generarAsiento?: boolean; tipo?: "MENSUAL" | "ANUAL" | string; }) {
    const { idPeriodo, idUsuario } = opts;
    const tipo = (opts.tipo === "ANUAL" ? "ANUAL" : "MENSUAL") as "MENSUAL" | "ANUAL";

    const valid = await this.validatePeriodo(idPeriodo);
    if (!valid.valido) {
      // Permite cerrar con errores? Si no, responde 409
      const err: any = new Error("Validación fallida");
      err.status = 409;
      err.data = valid;
      throw err;
    }

    return await AppDataSource.transaction(async (manager) => {
      // doble verificación de cierre existente
      const existe = await manager.query(
        `SELECT COUNT(1) as CNT FROM CONTABILIDAD.CIERRE_CONTABLE WHERE id_periodo = :id`,
        [idPeriodo]
      );
      if (Number(existe?.[0]?.CNT || 0) > 0) {
        const e: any = new Error("Ya existe un cierre para este período.");
        e.status = 409;
        throw e;
      }

      const now = new Date();
      const cierre = manager.getRepository(CierreContable).create({
        idPeriodo,
        idUsuario,
        fechaCierre: now,
        tipo,
        estado: "VALIDO",
        totalDebito: valid.totales.debito,
        totalCredito: valid.totales.credito,
        errores: null,
      });

      const saved = await manager.getRepository(CierreContable).save(cierre);

      // Actualiza PERIODO a CERRADO
      await manager.query(
        `UPDATE CONTABILIDAD.PERIODO_CONTABLE SET estado = 'CERRADO' WHERE id_periodo = :id`,
        [idPeriodo]
      );

      // Opcional: generar asiento de cierre (no implementado aquí)
      // if (opts.generarAsiento) { ... }

      return saved;
    });
  }

  // ============== NUEVO: Reabrir período ==============
  async reabrir(idPeriodo: number): Promise<boolean> {
    return await AppDataSource.transaction(async (manager) => {
      const cierre = await manager
        .getRepository(CierreContable)
        .findOne({ where: { idPeriodo } });

      if (!cierre) return false;

      await manager.getRepository(CierreContable).delete({ id: cierre.id });

      await manager.query(
        `UPDATE CONTABILIDAD.PERIODO_CONTABLE SET estado = 'ABIERTO' WHERE id_periodo = :id`,
        [idPeriodo]
      );

      return true;
    });
  }
}