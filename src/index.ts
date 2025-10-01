import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./app";

// Conectar a la base de datos

AppDataSource.initialize()
.then(() => {
  console.log("Conexión a la base de datos establecida correctamente");

  // Iniciar el servidor Express
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
})
.catch((error) => {
  console.error("Error al conectar a la base de datos", error);
});