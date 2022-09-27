import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";
import { Donador } from "./entity/Donador";
import { Turno } from "./entity/Donador";

export const appDataSource = new DataSource({
  type: "mysql",
  host: process.env.DBHOST ?? "localhost",
  port: parseInt(process.env.DBPORT ?? "3306"),
  username: process.env.DBUSER ?? "root",
  password: process.env.DBPASS ?? "pass",
  database: process.env.DB ?? "test",
  synchronize: true,
  logging: true,
  entities: [Administrador, Donador, Turno],
  subscribers: [],
  migrations: [],
});

export const connectDB = async () => {
  try {
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
      console.log("db running");
    }
  } catch {
    console.log("db not found");
  }
};

export const getRepoAdmins = async () => {
  await connectDB();
  return appDataSource.getRepository(Administrador);
};

export const getRepoTurnos = async () => {
  await connectDB();
  return appDataSource.getRepository(Turno);
};

export const getRepoDonadores = async () => {
  await connectDB();
  return appDataSource.getRepository(Donador);
};
