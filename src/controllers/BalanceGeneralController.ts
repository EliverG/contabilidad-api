import { Request, Response } from "express";
import { BalanceGeneralService } from "../services/BalanceGeneralService";
import { ExportacionService } from "../services/ExportacionService";

const balanceService = new BalanceGeneralService();
const exportacionService = new ExportacionService();

export class BalanceGeneralController {
  async generarBalance(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId } = req.body;

      if (!empresaId || !periodoId) {
        res.status(400).json({ message: "Se requieren empresaId y periodoId" });
        return ;
      }

      const balance = await balanceService.generarBalance(+empresaId, +periodoId);
      res.json(balance);
    } catch (error: any) {
      console.error('❌ Error al generar balance:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async generarReporteDetallado(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId } = req.body;

      if (!empresaId || !periodoId) {
        res.status(400).json({ message: "Se requieren empresaId y periodoId" });
        return ;
      }

      const reporte = await balanceService.generarReporteDetallado(+empresaId, +periodoId);
      res.json(reporte);
    } catch (error: any) {
      console.error('❌ Error al generar reporte detallado:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async generarReportePorSeccion(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, seccion } = req.body;

      if (!empresaId || !periodoId || !seccion) {
        res.status(400).json({ message: "Se requieren empresaId, periodoId y seccion" });
        return ;
      }

      if (!['ACTIVO', 'PASIVO', 'PATRIMONIO'].includes(seccion)) {
        res.status(400).json({ message: "Sección inválida" });
        return ;
      }

      const reporte = await balanceService.generarReportePorSeccion(+empresaId, +periodoId, seccion);
      res.json(reporte);
    } catch (error: any) {
      console.error('❌ Error en reporte por sección:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, tipoReporte, seccion } = req.body;

      if (!empresaId || !periodoId || !tipoReporte) {
        res.status(400).json({ message: "Faltan parámetros requeridos" });
        return ;
      }

      const empId = +empresaId;
      const perId = +periodoId;

      switch (tipoReporte) {
        case 'BALANCE_GENERAL':
          const balance = await balanceService.generarBalance(empId, perId);
          await exportacionService.exportarBalanceGeneralPDF(balance, res);
          break;

        case 'DETALLADO':
          const detallado = await balanceService.generarReporteDetallado(empId, perId);
          await exportacionService.exportarReporteDetalladoPDF(detallado, res);
          break;

        case 'SECCION':
          if (!seccion) {
            res.status(400).json({ message: "Sección requerida para este tipo de reporte" });
            return ;
          }
          const porSeccion = await balanceService.generarReportePorSeccion(empId, perId, seccion);
          await exportacionService.exportarReporteSeccionPDF(porSeccion, res);
          break;

        default:
          res.status(400).json({ message: "Tipo de reporte inválido" });
      }
    } catch (error: any) {
      console.error('❌ Error al exportar PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: error.message });
      } else {
        res.end();
      }
    }
  }

  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { empresaId, periodoId, tipoReporte, seccion } = req.body;

      if (!empresaId || !periodoId || !tipoReporte) {
        res.status(400).json({ message: "Faltan parámetros requeridos" });
        return 
      }

      const empId = +empresaId;
      const perId = +periodoId;

      switch (tipoReporte) {
        case 'BALANCE_GENERAL':
          const balance = await balanceService.generarBalance(empId, perId);
          await exportacionService.exportarBalanceGeneralExcel(balance, res);
          break;

        case 'DETALLADO':
          const detallado = await balanceService.generarReporteDetallado(empId, perId);
          await exportacionService.exportarReporteDetalladoExcel(detallado, res);
          break;

        case 'SECCION':
          if (!seccion) {
            res.status(400).json({ message: "Sección requerida para este tipo de reporte" });
            return 
          }
          const porSeccion = await balanceService.generarReportePorSeccion(empId, perId, seccion);
          await exportacionService.exportarReporteSeccionExcel(porSeccion, res);
          break;

        default:
          res.status(400).json({ message: "Tipo de reporte inválido" });
      }
    } catch (error: any) {
      console.error('❌ Error al exportar Excel:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: error.message });
      } else {
        res.end();
      }
    }
  }

  async exportarPDFPrueba(req: Request, res: Response): Promise<void> {
    try {
      await exportacionService.exportarPDFPrueba(res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async exportarExcelPrueba(req: Request, res: Response): Promise<void> {
    try {
      await exportacionService.exportarExcelPrueba(res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
