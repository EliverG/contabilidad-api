import { AppDataSource } from "../data-source";

export type ReportParams = {
  fechaInicio?: string;
  fechaFin?: string;
  idPeriodo?: number;
  idEmpresa?: number;
  incluirDetalle?: boolean;
};

export class EstadoResultadosService {
  private manager = AppDataSource.manager;

  private fechaFilter(params: ReportParams) {
    if (params.idPeriodo) return { sql: 'AND a.id_periodo = :idPeriodo', params: [params.idPeriodo] };
    if (params.fechaInicio && params.fechaFin) return { sql: `AND a.fecha BETWEEN TO_DATE(:fechaInicio,'YYYY-MM-DD') AND TO_DATE(:fechaFin,'YYYY-MM-DD')`, params: [params.fechaInicio, params.fechaFin] };
    return { sql: '', params: [] };
  }

  async preview(params: ReportParams) {
    const filter = this.fechaFilter(params);
    const whereSql = filter.sql;
    const bindParams: any[] = [];

    // Prepare bind params in order used below
    if (params.idPeriodo) bindParams.push(params.idPeriodo);
    if (params.fechaInicio && params.fechaFin) {
      bindParams.push(params.fechaInicio, params.fechaFin);
    }

    // Totals by account type
    const sqlTipo = `SELECT c.tipo AS tipo,
      NVL(SUM(d.debito),0) AS total_debito,
      NVL(SUM(d.credito),0) AS total_credito
    FROM CONTABILIDAD.DETALLE_ASIENTO d
    JOIN CONTABILIDAD.ASIENTO_CONTABLE a ON a.id_asiento = d.id_asiento
    JOIN CONTABILIDAD.CUENTA_CONTABLE c ON c.id_cuenta = d.id_cuenta
    WHERE a.estado = 'CONTABILIZADO' ${whereSql}
    GROUP BY c.tipo`;

    const rowsTipo = await this.manager.query(sqlTipo, bindParams);

    const tipoMap: Record<string, { debito: number; credito: number }> = {};
    rowsTipo.forEach((r: any) => {
      tipoMap[r.TIPO] = { debito: Number(r.TOTAL_DEBITO || 0), credito: Number(r.TOTAL_CREDITO || 0) };
    });

    const ingresos = (tipoMap['INGRESO']?.credito || 0) - (tipoMap['INGRESO']?.debito || 0);
    const gastos = (tipoMap['GASTO']?.debito || 0) - (tipoMap['GASTO']?.credito || 0);
    const resultado = ingresos - gastos;

    const result: any = {
      periodo: { fechaInicio: params.fechaInicio ?? null, fechaFin: params.fechaFin ?? null, idPeriodo: params.idPeriodo ?? null },
      resumen: { totalIngresos: ingresos, totalGastos: gastos, resultado },
      detallePorTipo: tipoMap,
    };

    if (params.incluirDetalle) {
      const sqlCuenta = `SELECT c.id_cuenta AS id, c.codigo AS codigo, c.nombre AS nombre, c.tipo AS tipo,
        NVL(SUM(d.debito),0) AS debito, NVL(SUM(d.credito),0) AS credito
      FROM CONTABILIDAD.DETALLE_ASIENTO d
      JOIN CONTABILIDAD.ASIENTO_CONTABLE a ON a.id_asiento = d.id_asiento
      JOIN CONTABILIDAD.CUENTA_CONTABLE c ON c.id_cuenta = d.id_cuenta
      WHERE a.estado = 'CONTABILIZADO' ${whereSql}
      GROUP BY c.id_cuenta, c.codigo, c.nombre, c.tipo
      ORDER BY c.codigo`;

      const rowsCuenta = await this.manager.query(sqlCuenta, bindParams);
      result.porCuenta = rowsCuenta.map((r: any) => ({
        id: r.ID,
        codigo: r.CODIGO,
        nombre: r.NOMBRE,
        tipo: r.TIPO,
        debito: Number(r.DEBITO || 0),
        credito: Number(r.CREDITO || 0),
        neto: (r.TIPO === 'INGRESO') ? (Number(r.CREDITO || 0) - Number(r.DEBITO || 0)) : (Number(r.DEBITO || 0) - Number(r.CREDITO || 0)),
      }));
    }

    return result;
  }
}

export default new EstadoResultadosService();
