import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";
import { Donador } from "./entity/Donador";
import { Turno } from "./entity/Donador";

export class App extends DataSource {
  private repoAdmin: Repository<Administrador>;
  constructor() {
    super({
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

    this.repoAdmin = this.getRepository(Administrador);
  }

  async connectDataSource() {
    return !this.isInitialized ? await this.initialize() : this;
  }

  async saveAdmin(params: { nombre: string; apellido: string; email: string }) {
    await this.connectDataSource();
    const admin = await this.repoAdmin.save(params);
    return admin;
  }
}

export const app = new App();
