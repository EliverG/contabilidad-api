import express, { Request, Response } from "express";
import cors from "cors"; //Borrar despues
import userRoutes from "./routers/userRoutes"; // Importamos las rutas de usuario
import CuentaContableRoutes from "./routers/CuentaContableRoutes";
import AsientoContableRoutes from "./routers/AsientoContableRoutes";

import BalanceGeneralRoutes from "./routers/BalanceGeneralRoutes";

import EmpresaRoutes from "./routers/EmpresaRoutes";
import PeriodoRoutes from "./routers/PeriodoRoutes";

// Crear una instancia de Express
const app = express();

// Configurar CORS - DEBE ESTAR ANTES de las rutas
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Configuración para recibir JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de rutas
app.use("/contabilidad", userRoutes);
app.use('/contabilidad/cuentas-contables', CuentaContableRoutes);
app.use('/contabilidad/asientos-contables', AsientoContableRoutes);

app.use('/contabilidad/balance-general', BalanceGeneralRoutes);

app.use("/contabilidad/empresas", EmpresaRoutes);
app.use("/contabilidad/periodos", PeriodoRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API!");
});

export default app;