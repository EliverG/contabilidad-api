import express, { Request, Response } from "express";
import userRoutes from "./routers/userRoutes"; // Importamos las rutas de usuario

// Crear una instancia de Express
const app = express();

// Configuración para recibir JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de rutas
app.use("/contabilidad", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API!");
});

export default app;