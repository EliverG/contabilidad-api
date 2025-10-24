import { RequestHandler } from 'express';
import estadoService, { ReportParams } from '../services/EstadoResultadosService';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class EstadoResultadosController {
  preview: RequestHandler = async (req, res) => {
    try {
      const params: ReportParams = {
        fechaInicio: req.query.fechaInicio as string | undefined,
        fechaFin: req.query.fechaFin as string | undefined,
        idPeriodo: req.query.idPeriodo ? Number(req.query.idPeriodo) : undefined,
        idEmpresa: req.query.idEmpresa ? Number(req.query.idEmpresa) : undefined,
        incluirDetalle: req.query.incluirDetalle === 'true',
      };
      const result = await estadoService.preview(params);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: 'Error al generar preview', error: err });
    }
  };

  export: RequestHandler = async (req, res) => {
    try {
      const body = req.body || {};
      const params: ReportParams = {
        fechaInicio: body.fechaInicio,
        fechaFin: body.fechaFin,
        idPeriodo: body.idPeriodo ? Number(body.idPeriodo) : undefined,
        idEmpresa: body.idEmpresa ? Number(body.idEmpresa) : undefined,
        incluirDetalle: Boolean(body.incluirDetalle),
      };

      const formato = (body.formato || 'xlsx').toLowerCase();
      const report = await estadoService.preview(params);

      if (formato === 'xlsx') {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Estado Resultados');
        ws.addRow(['Estado de Pérdidas y Ganancias']);
        ws.addRow([]);
        ws.addRow(['Periodo', params.fechaInicio ?? '', '-', params.fechaFin ?? '']);
        ws.addRow([]);
        ws.addRow(['Resumen']);
        ws.addRow(['Total Ingresos', report.resumen.totalIngresos]);
        ws.addRow(['Total Gastos', report.resumen.totalGastos]);
        ws.addRow(['Resultado', report.resumen.resultado]);
        ws.addRow([]);
        if (params.incluirDetalle && Array.isArray(report.porCuenta)) {
          ws.addRow(['Detalle por Cuenta']);
          ws.addRow(['Codigo', 'Nombre', 'Tipo', 'Debito', 'Credito', 'Neto']);
          report.porCuenta.forEach((c: any) => {
            ws.addRow([c.codigo, c.nombre, c.tipo, c.debito, c.credito, c.neto]);
          });
        }

        const buffer = await wb.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=estado_resultados.xlsx`);
        res.send(Buffer.from(buffer));
        return;
      }

      // PDF generation with pdfkit
      if (formato === 'pdf') {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks: any[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          const resultBuffer = Buffer.concat(chunks);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=estado_resultados.pdf`);
          res.send(resultBuffer);
        });

        doc.fontSize(16).text('Estado de Pérdidas y Ganancias', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Periodo: ${params.fechaInicio ?? ''} - ${params.fechaFin ?? ''}`);
        doc.moveDown();
        doc.fontSize(12).text('Resumen');
        doc.text(`Total Ingresos: ${report.resumen.totalIngresos}`);
        doc.text(`Total Gastos: ${report.resumen.totalGastos}`);
        doc.text(`Resultado: ${report.resumen.resultado}`);
        doc.moveDown();

        if (params.incluirDetalle && Array.isArray(report.porCuenta)) {
          doc.addPage();
          doc.fontSize(12).text('Detalle por Cuenta');
          report.porCuenta.forEach((c: any) => {
            doc.fontSize(10).text(`${c.codigo} ${c.nombre} - Debito: ${c.debito} - Credito: ${c.credito} - Neto: ${c.neto}`);
          });
        }

        doc.end();
        return;
      }

      res.status(400).json({ message: 'Formato no soportado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al generar export', error: err });
    }
  };
}

export default new EstadoResultadosController();
