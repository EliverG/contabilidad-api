import { AppDataSource } from "../data-source";

type LibroMayorParams = {
  empresa: number;
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
  cuenta?: number; // opcional (ID_CUENTA)
};

export class LibroMayorService {
  async consultar(params: LibroMayorParams) {
    const { empresa, desde, hasta, cuenta } = params;

    // WHERE con bind posicional Oracle :1, :2, :3, (:4 si hay cuenta)
    const whereParts: string[] = [
      "a.ESTADO = 'CONTABILIZADO'",
      "a.ID_EMPRESA = :1",
      "a.FECHA BETWEEN TO_DATE(:2, 'YYYY-MM-DD') AND TO_DATE(:3, 'YYYY-MM-DD')",
    ];
    const qp: any[] = [empresa, desde, hasta];

    if (cuenta) {
      whereParts.push("d.ID_CUENTA = :4");
      qp.push(cuenta);
    }

    const baseWhere = whereParts.join(" AND ");

    // 1) Movimientos del rango
    const movimientos = await AppDataSource.query(
      `
      SELECT
        a.ID_ASIENTO                      AS "idAsiento",
        a.NUMERO_ASIENTO                  AS "numeroAsiento",
        TO_CHAR(a.FECHA, 'YYYY-MM-DD')    AS "fecha",
        a.DESCRIPCION                     AS "descripcionAsiento",
        d.ID_DETALLE                      AS "idDetalle",
        d.ID_CUENTA                       AS "idCuenta",
        d.DEBITO                          AS "debito",
        d.CREDITO                         AS "credito",
        d.DESCRIPCION                     AS "descripcionDetalle",
        c.CODIGO                          AS "codigoCuenta",
        c.NOMBRE                          AS "nombreCuenta"
      FROM CONTABILIDAD.ASIENTO_CONTABLE a
      JOIN CONTABILIDAD.DETALLE_ASIENTO d ON d.ID_ASIENTO = a.ID_ASIENTO
      JOIN CONTABILIDAD.CUENTA_CONTABLE c ON c.ID_CUENTA = d.ID_CUENTA
      WHERE ${baseWhere}
      ORDER BY d.ID_CUENTA, a.FECHA, a.NUMERO_ASIENTO
      `,
      qp
    );

    // 2) Totales por cuenta
    const totalesPorCuenta = await AppDataSource.query(
      `
      SELECT
        d.ID_CUENTA           AS "idCuenta",
        c.CODIGO              AS "codigoCuenta",
        c.NOMBRE              AS "nombreCuenta",
        SUM(d.DEBITO)         AS "totalDebito",
        SUM(d.CREDITO)        AS "totalCredito"
      FROM CONTABILIDAD.ASIENTO_CONTABLE a
      JOIN CONTABILIDAD.DETALLE_ASIENTO d ON d.ID_ASIENTO = a.ID_ASIENTO
      JOIN CONTABILIDAD.CUENTA_CONTABLE c ON c.ID_CUENTA = d.ID_CUENTA
      WHERE ${baseWhere}
      GROUP BY d.ID_CUENTA, c.CODIGO, c.NOMBRE
      ORDER BY c.CODIGO
      `,
      qp
    );

    // 3) Armar respuesta agrupando movimientos por cuenta
    const movimientosMap = new Map<number, any[]>();
    for (const m of movimientos) {
      const key = Number(m.idCuenta);
      if (!movimientosMap.has(key)) movimientosMap.set(key, []);
      movimientosMap.get(key)!.push(m);
    }

    const resultados = totalesPorCuenta.map((t: any) => {
      const key = Number(t.idCuenta);
      return {
        cuenta: {
          id: key,
          codigo: t.codigoCuenta,
          nombre: t.nombreCuenta,
        },
        totales: {
          debito: Number(t.totalDebito || 0),
          credito: Number(t.totalCredito || 0),
        },
        movimientos: movimientosMap.get(key) ?? [],
      };
    });

    return { params, resultados };
  }
}
