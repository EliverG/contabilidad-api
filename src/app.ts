import express, { Request, Response } from "express";
import userRoutes from "./routers/userRoutes"; // Importamos las rutas de usuario
import CuentaContableRoutes from "./routers/CuentaContableRoutes";

// Crear una instancia de Express
const app = express();

// Configuración para recibir JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de rutas
app.use("/contabilidad", userRoutes);
app.use('/contabilidad/cuentas-contables', CuentaContableRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API!");
});

export default app;