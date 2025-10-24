import { AppDataSource } from "../data-source";
import { BalanceGeneral, CuentaBalance } from "../types/BalanceGeneral";

export class BalanceGeneralService {
  async generarBalance(idEmpresa: number, idPeriodo: number): Promise<BalanceGeneral> {
    try {
      console.log('🔄 Generando balance para empresa:', idEmpresa, 'periodo:', idPeriodo);

      // Validar existencia de empresa y periodo
      const [empresaExists, periodoExists] = await Promise.all([
        AppDataSource.query('SELECT 1 FROM EMPRESA WHERE id_empresa = :1', [idEmpresa]),
        AppDataSource.query('SELECT 1 FROM PERIODO_CONTABLE WHERE id_periodo = :1', [idPeriodo])
      ]);

      if (empresaExists.length === 0) {
        throw new Error(`Empresa con ID ${idEmpresa} no existe`);
      }

      if (periodoExists.length === 0) {
        throw new Error(`Periodo con ID ${idPeriodo} no existe`);
      }

      // Consulta SQL para obtener saldos
      const query = `
        SELECT 
          cc.codigo,
          cc.nombre as "nombreCuenta",
          cc.tipo,
          cc.naturaleza,
          COALESCE(SUM(
            CASE 
              WHEN cc.naturaleza = 'DEUDORA' THEN (COALESCE(da.debito, 0) - COALESCE(da.credito, 0))
              ELSE (COALESCE(da.credito, 0) - COALESCE(da.debito, 0))
            END
          ), 0) as saldo
        FROM CUENTA_CONTABLE cc
        LEFT JOIN DETALLE_ASIENTO da ON cc.id_cuenta = da.id_cuenta
        LEFT JOIN ASIENTO_CONTABLE ac ON da.id_asiento = ac.id_asiento
        LEFT JOIN PERIODO_CONTABLE pc ON ac.id_periodo = pc.id_periodo
        LEFT JOIN EMPRESA emp ON ac.id_empresa = emp.id_empresa
        WHERE emp.id_empresa = :1
          AND pc.id_periodo = :2
          AND ac.estado = 'CONTABILIZADO'
          AND cc.tipo IN ('ACTIVO', 'PASIVO', 'PATRIMONIO')
          AND cc.estado = 'ACTIVO'
        GROUP BY cc.codigo, cc.nombre, cc.tipo, cc.naturaleza
        ORDER BY cc.codigo
      `;

      const resultados = await AppDataSource.query(query, [idEmpresa, idPeriodo]);

      const activos = resultados.filter((r: any) => r.TIPO === 'ACTIVO');
      const pasivos = resultados.filter((r: any) => r.TIPO === 'PASIVO');
      const patrimonio = resultados.filter((r: any) => r.TIPO === 'PATRIMONIO');

      const balance: BalanceGeneral = {
        empresaId: idEmpresa,
        periodoId: idPeriodo,
        fechaGeneracion: new Date().toISOString(),
        activos: this.mapearCuentas(activos),
        pasivos: this.mapearCuentas(pasivos),
        patrimonio: this.mapearCuentas(patrimonio),
        totalActivos: this.calcularTotal(activos),
        totalPasivos: this.calcularTotal(pasivos),
        totalPatrimonio: this.calcularTotal(patrimonio)
      };

      return balance;
    } catch (error: any) {
      console.error('❌ Error en generarBalance:', error);
      throw new Error(`Error al generar balance: ${error.message}`);
    }
  }

  // 🔍 Reporte detallado
  async generarReporteDetallado(idEmpresa: number, idPeriodo: number): Promise<any> {
    try {
      const query = `
        SELECT 
          ac.numero_asiento as "numeroAsiento",
          ac.fecha,
          ac.descripcion as "descripcionAsiento",
          ac.tipo as "tipoAsiento",
          cc.codigo as "codigoCuenta",
          cc.nombre as "nombreCuenta",
          cc.tipo as "tipoCuenta",
          da.descripcion as "descripcionMovimiento",
          da.debito,
          da.credito,
          cc2.codigo as "centroCostoCodigo",
          cc2.nombre as "centroCostoNombre",
          p.codigo as "proyectoCodigo",
          p.nombre as "proyectoNombre"
        FROM ASIENTO_CONTABLE ac
        INNER JOIN DETALLE_ASIENTO da ON ac.id_asiento = da.id_asiento
        INNER JOIN CUENTA_CONTABLE cc ON da.id_cuenta = cc.id_cuenta
        LEFT JOIN CENTRO_COSTO cc2 ON da.id_centro_costo = cc2.id_centro_costo
        LEFT JOIN PROYECTO p ON da.id_proyecto = p.id_proyecto
        WHERE ac.id_empresa = :1
          AND ac.id_periodo = :2
          AND ac.estado = 'CONTABILIZADO'
          AND cc.tipo IN ('ACTIVO', 'PASIVO', 'PATRIMONIO')
        ORDER BY ac.fecha, ac.numero_asiento, cc.codigo
      `;

      const resultados = await AppDataSource.query(query, [idEmpresa, idPeriodo]);

      return {
        empresaId: idEmpresa,
        periodoId: idPeriodo,
        fechaGeneracion: new Date().toISOString(),
        asientos: resultados.map((r: any) => ({
          numeroAsiento: r.numeroAsiento,
          fecha: r.FECHA,
          descripcionAsiento: r.descripcionAsiento,
          tipoAsiento: r.tipoAsiento,
          codigoCuenta: r.codigoCuenta,
          nombreCuenta: r.nombreCuenta,
          tipoCuenta: r.tipoCuenta,
          descripcionMovimiento: r.descripcionMovimiento,
          debito: parseFloat(r.DEBITO || 0),
          credito: parseFloat(r.CREDITO || 0),
          centroCosto: r.centroCostoCodigo ? {
            codigo: r.centroCostoCodigo,
            nombre: r.centroCostoNombre
          } : null,
          proyecto: r.proyectoCodigo ? {
            codigo: r.proyectoCodigo,
            nombre: r.proyectoNombre
          } : null
        }))
      };
    } catch (error: any) {
      console.error('❌ Error en generarReporteDetallado:', error);
      throw new Error(`Error al generar reporte detallado: ${error.message}`);
    }
  }

  // 🔍 Reporte por sección
  async generarReportePorSeccion(idEmpresa: number, idPeriodo: number, seccion: string): Promise<any> {
    try {
      const query = `
        SELECT 
          ac.numero_asiento as "numeroAsiento",
          ac.fecha,
          ac.descripcion as "descripcionAsiento",
          cc.codigo as "codigoCuenta",
          cc.nombre as "nombreCuenta",
          da.descripcion as "descripcionMovimiento",
          da.debito,
          da.credito,
          cc2.codigo as "centroCostoCodigo",
          p.codigo as "proyectoCodigo"
        FROM ASIENTO_CONTABLE ac
        INNER JOIN DETALLE_ASIENTO da ON ac.id_asiento = da.id_asiento
        INNER JOIN CUENTA_CONTABLE cc ON da.id_cuenta = cc.id_cuenta
        LEFT JOIN CENTRO_COSTO cc2 ON da.id_centro_costo = cc2.id_centro_costo
        LEFT JOIN PROYECTO p ON da.id_proyecto = p.id_proyecto
        WHERE ac.id_empresa = :1
          AND ac.id_periodo = :2
          AND ac.estado = 'CONTABILIZADO'
          AND cc.tipo = :3
        ORDER BY cc.codigo, ac.fecha, ac.numero_asiento
      `;

      const resultados = await AppDataSource.query(query, [idEmpresa, idPeriodo, seccion]);

      return {
        empresaId: idEmpresa,
        periodoId: idPeriodo,
        seccion: seccion,
        fechaGeneracion: new Date().toISOString(),
        movimientos: resultados.map((r: any) => ({
          numeroAsiento: r.numeroAsiento,
          fecha: r.FECHA,
          descripcionAsiento: r.descripcionAsiento,
          codigoCuenta: r.codigoCuenta,
          nombreCuenta: r.nombreCuenta,
          descripcionMovimiento: r.descripcionMovimiento,
          debito: parseFloat(r.DEBITO || 0),
          credito: parseFloat(r.CREDITO || 0),
          centroCosto: r.centroCostoCodigo,
          proyecto: r.proyectoCodigo
        }))
      };
    } catch (error: any) {
      console.error(`❌ Error en generarReportePorSeccion (${seccion}):`, error);
      throw new Error(`Error al generar reporte de ${seccion}: ${error.message}`);
    }
  }

  // Utilidades
  private mapearCuentas(cuentas: any[]): CuentaBalance[] {
    return cuentas.map(cuenta => ({
      codigo: cuenta.CODIGO,
      nombreCuenta: cuenta.nombreCuenta,
      tipo: cuenta.TIPO,
      naturaleza: cuenta.NATURALEZA,
      saldo: parseFloat(cuenta.SALDO) || 0
    }));
  }

  private calcularTotal(cuentas: any[]): number {
    return cuentas.reduce((sum, cuenta) => sum + parseFloat(cuenta.SALDO || 0), 0);
  }
}
