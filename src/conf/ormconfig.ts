import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const config: DataSourceOptions = {
  type: "oracle",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1521'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  sid: process.env.DB_SID,
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"]
};

export default config;