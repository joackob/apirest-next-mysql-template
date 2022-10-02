import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";

type ResultAppOperation = {
  affected: boolean;
};

export class App {
  private repoAdmin: Repository<Administrador>;
  private repo: DataSource;

  constructor() {
    this.repo = new DataSource({
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

    this.repoAdmin = this.repo.getRepository(Administrador);
  }

  private async connectDataSource() {
    return !this.repo.isInitialized ? await this.repo.initialize() : this.repo;
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
    const res = await this.repoAdmin.update({ id: params.id }, params);
    const affected: ResultAppOperation = {
      affected: res.affected === 1,
    };

    return affected;
  }

  async destroy() {
    await this.connectDataSource();
    await this.repo.destroy();

    return this;
  }

  async findAdmin(params: { id: number }) {
    await this.connectDataSource();
    const res = await this.repoAdmin.findOne({
      where: {
        id: params.id,
      },
    });

    return res;
  }

  async deleteAdmin(params: { id: number }) {
    await this.connectDataSource();
    const res = await this.repoAdmin.delete({
      id: params.id,
    });
    const affected: ResultAppOperation = {
      affected: res.affected === 1,
    };

    return affected;
  }
}

export const app = new App();
