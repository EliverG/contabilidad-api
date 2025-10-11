import express, { Request, Response } from "express";
import userRoutes from "./routers/userRoutes"; // Importamos las rutas de usuario
import CuentaContableRoutes from "./routers/CuentaContableRoutes";
import empresaRoutes from './routers/empresaRoutes';
import periodoContableRoutes from './routers/PeriodoContableRoutes';
import libroDiario from './routers/LibroDiarioRoutes'

// Crear una instancia de Express
const app = express();
// Configuración para recibir JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de rutas
app.use("/contabilidad", userRoutes);
app.use('/contabilidad/cuentas-contables', CuentaContableRoutes);
app.use('/contabilidad/empresa', empresaRoutes);
app.use('/contabilidad/periodo-contable', periodoContableRoutes);
app.use('/contabilidad/libro-diario', libroDiario);

app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API!");
});



export default app;