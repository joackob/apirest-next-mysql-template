import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";

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
      entities: [Administrador],
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
  async updateAdmin(params: {
    id: number;
    nombre?: string;
    apellido?: string;
    email?: string;
  }) {
    await this.connectDataSource();
    const admin = await this.repoAdmin.update(params.id, params);
    return admin;
  }
}

export const app = new App();
