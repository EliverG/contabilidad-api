import express, { Request, Response } from "express";
import cors from "cors"; //Borrar despues
import userRoutes from "./routers/userRoutes"; // Importamos las rutas de usuario
import CuentaContableRoutes from "./routers/CuentaContableRoutes";
import empresaRoutes from './routers/EmpresaRoutes';
import periodoContableRoutes from './routers/PeriodoContableRoutes';
import libroDiario from './routers/LibroDiarioRoutes';
import libroMayorRoutes from "./routers/libroMayorRoutes";
import AsientoContableRoutes from "./routers/AsientoContableRoutes";
import BalanceGeneralRoutes from "./routers/BalanceGeneralRoutes";
import PeriodoRoutes from "./routers/PeriodoRoutes";
// Configuración para recibir JSON en el cuerpo de las solicitudes
const app = express();
app.use(express.json());
app.use(cors()); // 👈 ¡Mantén esto!
// Configuración de rutas
app.use("/contabilidad", userRoutes);
app.use('/contabilidad/cuentas-contables', CuentaContableRoutes);
app.use('/contabilidad/empresa', empresaRoutes);
app.use('/contabilidad/periodo-contable', periodoContableRoutes);
app.use('/contabilidad/libro-diario', libroDiario);
app.use("/contabilidad/libro-mayor", libroMayorRoutes);
app.use('/contabilidad/asientos-contables', AsientoContableRoutes);
app.use('/contabilidad/balance-general', BalanceGeneralRoutes);
app.use("/contabilidad/periodos", PeriodoRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API!");
});



export default app;