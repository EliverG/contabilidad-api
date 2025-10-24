import { AppDataSource } from "../data-source";
import { BalanceGeneral, CuentaBalance } from "../types/BalanceGeneral";

export class BalanceGeneralService {
  async generarBalance(idEmpresa: number, idPeriodo: number): Promise<BalanceGeneral> {
    try {
      console.log('🔄 Generando balance para empresa:', idEmpresa, 'periodo:', idPeriodo);

      // Verificar que la empresa y periodo existen
      const empresaExists = await AppDataSource.query(
        'SELECT 1 FROM EMPRESA WHERE id_empresa = :1',
        [idEmpresa]
      );
      
      const periodoExists = await AppDataSource.query(
        'SELECT 1 FROM PERIODO_CONTABLE WHERE id_periodo = :1',
        [idPeriodo]
      );

      if (empresaExists.length === 0) {
        throw new Error(`Empresa con ID ${idEmpresa} no existe`);
      }

      if (periodoExists.length === 0) {
        throw new Error(`Periodo con ID ${idPeriodo} no existe`);
      }

      
      
      
      
      
      
      
      
      // Consulta principal
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

      console.log('📊 Ejecutando consulta SQL...');
      const resultados = await AppDataSource.query(query, [idEmpresa, idPeriodo]);
      console.log('✅ Resultados obtenidos:', resultados);
      
      // CORREGIR: Usar MAYÚSCULAS para filtrar (Oracle devuelve en mayúsculas)
      const activos = resultados.filter((r: any) => r.TIPO === 'ACTIVO');
      const pasivos = resultados.filter((r: any) => r.TIPO === 'PASIVO');
      const patrimonio = resultados.filter((r: any) => r.TIPO === 'PATRIMONIO');

      console.log('📈 Cuentas encontradas:', {
        activos: activos.length,
        pasivos: pasivos.length,
        patrimonio: patrimonio.length
      });

      // Mapear los resultados a minúsculas para el frontend
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

      console.log('💰 Balance generado exitosamente');
      console.log('📊 Resumen balance:', {
        totalActivos: balance.totalActivos,
        totalPasivos: balance.totalPasivos,
        totalPatrimonio: balance.totalPatrimonio
      });
      
      return balance;
    } catch (error: any) {
      console.error('❌ Error en generarBalance:', error);
      throw new Error(`Error al generar balance: ${error.message}`);
    }
  }



















  async generarReporteDetallado(idEmpresa: number, idPeriodo: number): Promise<any> {
    try {
      console.log('🔄 Generando reporte detallado para empresa:', idEmpresa, 'periodo:', idPeriodo);

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
          tipoCuenta: r.TIPOCUENTA,
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

  async generarReportePorSeccion(idEmpresa: number, idPeriodo: number, seccion: string): Promise<any> {
    try {
      console.log(`🔄 Generando reporte de ${seccion} para empresa:`, idEmpresa);

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






private mapearCuentas(cuentas: any[]): CuentaBalance[] {
  return cuentas.map(cuenta => {
    // DEBUG: Log para verificar los datos crudos
    console.log('🔍 Cuenta cruda:', {
      codigo: cuenta.CODIGO,
      nombre: cuenta.nombreCuenta,
      saldoRaw: cuenta.SALDO,
      saldoType: typeof cuenta.SALDO
    });

    const saldo = parseFloat(cuenta.SALDO) || 0;
    
    return {
      codigo: cuenta.CODIGO,
      nombreCuenta: cuenta.nombreCuenta,
      tipo: cuenta.TIPO as 'ACTIVO' | 'PASIVO' | 'PATRIMONIO',
      naturaleza: cuenta.NATURALEZA as 'DEUDORA' | 'ACREEDORA',
      saldo: saldo
    };
  });
}











  




  

  private calcularTotal(cuentas: any[]): number {
    return cuentas.reduce((sum, cuenta) => sum + parseFloat(cuenta.SALDO || 0), 0);
  }

  async generarBalancePorAnio(idEmpresa: number, anio: number): Promise<BalanceGeneral> {
    console.log('📅 Generando balance por año:', anio);

    const periodos = await AppDataSource.query(
      `SELECT id_periodo FROM PERIODO_CONTABLE 
       WHERE id_empresa = :1 AND EXTRACT(YEAR FROM fecha_inicio) = :2`,
      [idEmpresa, anio]
    );

    if (periodos.length === 0) {
      throw new Error(`No se encontraron periodos para el año ${anio}`);
    }

    const periodosIds = periodos.map((p: any) => p.ID_PERIODO || p.id_periodo);
    console.log('✅ Periodos del año:', periodosIds);

    const query = `
      SELECT 
        cc.codigo,
        cc.nombre as nombre_cuenta,
        cc.tipo,
        cc.naturaleza,
        SUM(CASE 
          WHEN cc.naturaleza = 'DEUDORA' THEN (da.debito - da.credito)
          ELSE (da.credito - da.debito)
        END) as saldo
      FROM CUENTA_CONTABLE cc
      LEFT JOIN DETALLE_ASIENTO da ON cc.id_cuenta = da.id_cuenta
      LEFT JOIN ASIENTO_CONTABLE ac ON da.id_asiento = ac.id_asiento
      LEFT JOIN PERIODO_CONTABLE pc ON ac.id_periodo = pc.id_periodo
      LEFT JOIN EMPRESA emp ON ac.id_empresa = emp.id_empresa
      WHERE emp.id_empresa = :1
        AND pc.id_periodo IN (${periodosIds.join(',')})
        AND ac.estado = 'CONTABILIZADO'
        AND cc.tipo IN ('ACTIVO', 'PASIVO', 'PATRIMONIO')
      GROUP BY cc.codigo, cc.nombre, cc.tipo, cc.naturaleza
      ORDER BY cc.codigo
    `;

    const resultado = await AppDataSource.query(query, [idEmpresa]);

    // Separar las cuentas por tipo
    const activos = resultado.filter((r: any) => r.TIPO === 'ACTIVO');
    const pasivos = resultado.filter((r: any) => r.TIPO === 'PASIVO');
    const patrimonio = resultado.filter((r: any) => r.TIPO === 'PATRIMONIO');

    return {
      empresaId: idEmpresa,
      periodoId: 0,
      fechaGeneracion: new Date().toISOString(),
      activos: this.mapearCuentas(activos),
      pasivos: this.mapearCuentas(pasivos),
      patrimonio: this.mapearCuentas(patrimonio),
      totalActivos: this.calcularTotal(activos),
      totalPasivos: this.calcularTotal(pasivos),
      totalPatrimonio: this.calcularTotal(patrimonio)
    };
  }
}

