// routes/BalanceGeneralRoutes.ts
import { Router } from 'express';
import { BalanceGeneralController } from '../controllers/BalanceGeneralController';

const balanceGeneralController = new BalanceGeneralController();
const router = Router();

router.post('/generar', (req, res) => balanceGeneralController.generarBalance(req, res));




router.post('/reporte-detallado', (req, res) => balanceGeneralController.generarReporteDetallado(req, res));
router.post('/reporte-seccion', (req, res) => balanceGeneralController.generarReportePorSeccion(req, res));
router.post('/exportar-excel', (req, res) => balanceGeneralController.exportarExcel(req, res));
router.post('/exportar-pdf', (req, res) => balanceGeneralController.exportarPDF(req, res));
router.get('/prueba-pdf', (req, res) => balanceGeneralController.exportarPDFPrueba(req, res));
router.get('/prueba-excel', (req, res) => balanceGeneralController.exportarExcelPrueba(req, res));




export default router;