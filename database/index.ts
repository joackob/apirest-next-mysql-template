import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";
import { Donador } from "./entity/Donador";
import { Turno } from "./entity/Donador";

export const dataSource = new DataSource({
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

export const createDataSource = async () => {
  return !dataSource.isInitialized ? await dataSource.initialize() : dataSource;
};

export const createRepoAdmins = async () => {
  await createDataSource();
  return dataSource.getRepository(Administrador);
};

export const createRepoTurnos = async () => {
  await createDataSource();
  return dataSource.getRepository(Turno);
};

export const createRepoDonadores = async () => {
  await createDataSource();
  return dataSource.getRepository(Donador);
};
