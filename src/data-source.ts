import { DataSource } from "typeorm";
import config from "./conf/ormconfig";

export const AppDataSource = new DataSource(config);