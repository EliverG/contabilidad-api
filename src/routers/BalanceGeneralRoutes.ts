// routes/BalanceGeneralRoutes.ts
import { Router } from 'express';
import { BalanceGeneralController } from '../controllers/BalanceGeneralController';

const router = Router();
const controller = new BalanceGeneralController();

// 🧾 Generación de datos
router.post('/generar', (req, res) => controller.generarBalance(req, res));
router.post('/reporte-detallado', (req, res) => controller.generarReporteDetallado(req, res));
router.post('/reporte-seccion', (req, res) => controller.generarReportePorSeccion(req, res));

// 📄 Exportaciones
router.post('/exportar-pdf', (req, res) => controller.exportarPDF(req, res));
router.post('/exportar-excel', (req, res) => controller.exportarExcel(req, res));

// 🧪 Rutas de prueba
router.get('/prueba-pdf', (req, res) => controller.exportarPDFPrueba(req, res));
router.get('/prueba-excel', (req, res) => controller.exportarExcelPrueba(req, res));

export default router;
