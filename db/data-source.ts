import { DataSource } from "typeorm";
import { Photo } from "./entity/Photo";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DBHOST ?? "localhost",
  port: parseInt(process.env.DBPORT ?? "3306"),
  username: process.env.DBUSER ?? "root",
  password: process.env.DBPASS ?? "pass",
  database: process.env.DB ?? "test",
  synchronize: true,
  logging: true,
  entities: [Photo],
  subscribers: [],
  migrations: [],
});

export const connectDB = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("db running");
    }
  } catch {
    console.log("db not found");
  }
};
