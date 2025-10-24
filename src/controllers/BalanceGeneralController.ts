import { Request, Response } from "express";
import { BalanceGeneralService } from "../services/BalanceGeneralService";
import { ExportacionService } from "../services/ExportacionService";

const service = new BalanceGeneralService();
const exportacionService = new ExportacionService();

export class BalanceGeneralController {
  async generarBalance(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, porAnio, anio } = req.body;

      console.log('🧾 Parámetros recibidos:', { empresaId, periodoId, porAnio, anio });

      // Validación básica de parámetros
      if (!empresaId) {
        res.status(400).json({
          message: "El parámetro empresaId es requerido"
        });
        return;
      }

      if (porAnio) {
        if (!anio) {
          res.status(400).json({
            message: "Cuando porAnio está activo, el parámetro anio es requerido"
          });
          return;
        }
      } else {
        if (!periodoId) {
          res.status(400).json({
            message: "El parámetro periodoId es requerido cuando porAnio no está activo"
          });
          return;
        }
      }

      const empId = parseInt(empresaId.toString());
      if (isNaN(empId)) {
        res.status(400).json({
          message: "empresaId debe ser un número válido"
        });
        return;
      }

      let balance;
      if (porAnio) {
        const anioNum = parseInt(anio.toString());
        if (isNaN(anioNum)) {
          res.status(400).json({
            message: "anio debe ser un número válido"
          });
          return;
        }
        balance = await service.generarBalancePorAnio(empId, anioNum);
      } else {
        const perId = parseInt(periodoId.toString());
        if (isNaN(perId)) {
          res.status(400).json({
            message: "periodoId debe ser un número válido"
          });
          return;
        }
        balance = await service.generarBalance(empId, perId);
      }

      console.log('✅ Balance generado exitosamente');
      res.json(balance);
    } catch (error: any) {
      console.error('❌ Error al generar balance:', error);
      res.status(500).json({ 
        message: "Error al generar el balance general", 
        error: error.message 
      });
    }
  }































  async generarReporteDetallado(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, porAnio, anio } = req.body;

      console.log('🧾 Parámetros recibidos:', { empresaId, periodoId, porAnio, anio });

      if (!empresaId || (porAnio && !anio && !periodoId) || (!porAnio && !periodoId)) {
        res.status(400).json({ 
          message: "Debe proporcionar empresaId y periodoId, o activar porAnio con el campo anio correspondiente." 
        });
        return;
      }

      let balance;
      if (porAnio && anio) {
        balance = await service.generarBalancePorAnio(parseInt(empresaId.toString()), parseInt(anio.toString()));
      } else {
        balance = await service.generarBalance(parseInt(empresaId.toString()), parseInt(periodoId.toString()));
      }
      
      console.log('📥 Solicitud de reporte detallado recibida:', { empresaId, periodoId });

      if (!empresaId || !periodoId) {
        res.status(400).json({ 
          message: "Los parámetros empresaId y periodoId son requeridos" 
        });
        return;
      }

      const reporte = await service.generarReporteDetallado(
        parseInt(empresaId.toString()), 
        parseInt(periodoId.toString())
      );
      
      console.log('✅ Reporte detallado generado exitosamente');
      res.json(reporte);
    } catch (error: any) {
      console.error('❌ Error al generar reporte detallado:', error);
      res.status(500).json({ 
        message: "Error al generar el reporte detallado", 
        error: error.message 
      });
    }
  }

  async generarReportePorSeccion(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, seccion } = req.body;
      
      console.log('📥 Solicitud de reporte por sección recibida:', { empresaId, periodoId, seccion });

      if (!empresaId || !periodoId || !seccion) {
        res.status(400).json({ 
          message: "Los parámetros empresaId, periodoId y seccion son requeridos" 
        });
        return;
      }

      if (!['ACTIVO', 'PASIVO', 'PATRIMONIO'].includes(seccion)) {
        res.status(400).json({ 
          message: "La sección debe ser ACTIVO, PASIVO o PATRIMONIO" 
        });
        return;
      }

      const reporte = await service.generarReportePorSeccion(
        parseInt(empresaId.toString()), 
        parseInt(periodoId.toString()),
        seccion
      );
      
      console.log(`✅ Reporte de ${seccion} generado exitosamente`);
      res.json(reporte);
    } catch (error: any) {
      console.error('❌ Error al generar reporte por sección:', error);
      res.status(500).json({ 
        message: "Error al generar el reporte por sección", 
        error: error.message 
      });
    }
  }




















  

  async exportarPDF(req: Request, res: Response): Promise<void> {
  try {
    const { empresaId, periodoId, tipoReporte, seccion } = req.body;

    console.log('📥 Solicitud de exportación PDF recibida:', {
      empresaId, periodoId, tipoReporte, seccion
    });

    if (!empresaId || !periodoId || !tipoReporte) {
      res.status(400).json({
        message: "Los parámetros empresaId, periodoId y tipoReporte son requeridos"
      });
      return;
    }

    // Validar que los parámetros son números válidos
    const empId = parseInt(empresaId.toString());
    const perId = parseInt(periodoId.toString());

    if (isNaN(empId) || isNaN(perId)) {
      res.status(400).json({
        message: "empresaId y periodoId deben ser números válidos"
      });
      return;
    }

    console.log(`🔄 Procesando exportación PDF para tipo: ${tipoReporte}`);

    switch (tipoReporte) {
      case 'BALANCE_GENERAL':
        console.log('🔄 Generando balance para PDF...');
        const balance = await service.generarBalance(empId, perId);
        console.log('✅ Balance generado, exportando a PDF...');
        await exportacionService.exportarBalanceGeneralPDF(balance, res);
        break;

      case 'DETALLADO':
        console.log('🔄 Generando reporte detallado para PDF...');
        const reporteDetallado = await service.generarReporteDetallado(empId, perId);
        console.log('✅ Reporte detallado generado, exportando a PDF...');
        await exportacionService.exportarReporteDetalladoPDF(reporteDetallado, res);
        break;

      case 'SECCION':
        if (!seccion) {
          res.status(400).json({
            message: "El parámetro seccion es requerido para reportes por sección"
          });
          return;
        }
        console.log(`🔄 Generando reporte de sección ${seccion} para PDF...`);
        const reporteSeccion = await service.generarReportePorSeccion(empId, perId, seccion);
        console.log('✅ Reporte de sección generado, exportando a PDF...');
        await exportacionService.exportarReporteSeccionPDF(reporteSeccion, res);
        break;

      default:
        res.status(400).json({
          message: "Tipo de reporte no válido. Use: BALANCE_GENERAL, DETALLADO o SECCION"
        });
        return;
    }

    console.log('✅ Exportación PDF completada exitosamente');

  } catch (error: any) {
    console.error('❌ Error al exportar PDF:', error);
    console.error('Stack trace:', error.stack);

    // Solo enviar error si los headers no se han enviado
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error al exportar a PDF",
        error: error.message
      });
    } else {
      console.error('⚠️ No se pudo enviar error al cliente - headers ya enviados');
      // Forzar cierre de la respuesta
      res.end();
    }
  }
}















  async exportarExcel(req: Request, res: Response): Promise<void> {
  try {
    const { empresaId, periodoId, tipoReporte, seccion } = req.body;
    
    console.log('📥 Solicitud de exportación Excel recibida:', { 
      empresaId, periodoId, tipoReporte, seccion 
    });

    if (!empresaId || !periodoId || !tipoReporte) {
      res.status(400).json({ 
        message: "Los parámetros empresaId, periodoId y tipoReporte son requeridos" 
      });
      return;
    }

    // Verificar que los headers no se hayan enviado ya
    if (res.headersSent) {
      console.warn('⚠️ Headers ya enviados, abortando exportación Excel');
      return;
    }

    console.log(`🔄 Procesando exportación Excel para tipo: ${tipoReporte}`);

    switch (tipoReporte) {
      case 'BALANCE_GENERAL':
        console.log('🔄 Generando balance para Excel...');
        const balance = await service.generarBalance(
          parseInt(empresaId.toString()), 
          parseInt(periodoId.toString())
        );
        console.log('✅ Balance generado, exportando a Excel...');
        await exportacionService.exportarBalanceGeneralExcel(balance, res);
        break;

      case 'DETALLADO':
        console.log('🔄 Generando reporte detallado para Excel...');
        const reporteDetallado = await service.generarReporteDetallado(
          parseInt(empresaId.toString()), 
          parseInt(periodoId.toString())
        );
        console.log('✅ Reporte detallado generado, exportando a Excel...');
        await exportacionService.exportarReporteDetalladoExcel(reporteDetallado, res);
        break;

      case 'SECCION':
        if (!seccion) {
          res.status(400).json({ 
            message: "El parámetro seccion es requerido para reportes por sección" 
          });
          return;
        }
        console.log(`🔄 Generando reporte de sección ${seccion} para Excel...`);
        const reporteSeccion = await service.generarReportePorSeccion(
          parseInt(empresaId.toString()), 
          parseInt(periodoId.toString()),
          seccion
        );
        console.log('✅ Reporte de sección generado, exportando a Excel...');
        await exportacionService.exportarReporteSeccionExcel(reporteSeccion, res);
        break;

      default:
        res.status(400).json({ 
          message: "Tipo de reporte no válido. Use: BALANCE_GENERAL, DETALLADO o SECCION" 
        });
        return;
    }

    console.log('✅ Exportación Excel completada exitosamente');

  } catch (error: any) {
    console.error('❌ Error al exportar Excel:', error);
    console.error('Stack trace:', error.stack);
    
    // Solo enviar error si los headers no se han enviado
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Error al exportar a Excel", 
        error: error.message 
      });
    } else {
      console.error('⚠️ No se pudo enviar error al cliente - headers ya enviados');
    }
  }
}


























































async exportarPDFPrueba(req: Request, res: Response): Promise<void> {
    try {
      console.log('🧪 Solicitando PDF de prueba...');
      await exportacionService.exportarPDFPrueba(res);
    } catch (error: any) {
      console.error('❌ Error en PDF de prueba:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error en PDF de prueba", error: error.message });
      }
    }
  }

  async exportarExcelPrueba(req: Request, res: Response): Promise<void> {
    try {
      console.log('🧪 Solicitando Excel de prueba...');
      await exportacionService.exportarExcelPrueba(res);
    } catch (error: any) {
      console.error('❌ Error en Excel de prueba:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error en Excel de prueba", error: error.message });
      }
    }
  }
















}