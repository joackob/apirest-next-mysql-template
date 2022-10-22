import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";
import { ResultDelete, ResultSave, ResultUpdate } from "./types/TypesResult";

export class RepoAdmins {
  private repo: Repository<Administrador>;
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
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

    this.repo = this.dataSource.getRepository(Administrador);
  }

  async initialize() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    return this;
  }

  async destroy() {
    await this.initialize();
    await this.dataSource.destroy();
    return this;
  }

  private async findByEmail(email: string) {
    return await this.repo
      .createQueryBuilder("admin")
      .where("admin.email = :email", { email })
      .getOne();
  }

  async save(params: {
    nombre: string;
    apellido: string;
    email: string;
  }): Promise<Administrador> {
    await this.initialize();
    const { email } = params;
    const adminFound = await this.findByEmail(email);
    return adminFound ?? (await this.repo.save(params));
  }

  async updateByID(params: {
    id: number;
    nombre?: string;
    apellido?: string;
    email?: string;
  }): Promise<ResultUpdate> {
    await this.initialize();
    const { id } = params;
    const { affected } = await this.repo.update({ id }, params);
    return {
      wasUpdated: affected === 1,
    };
  }

  async findByID(params: { id: number }) {
    await this.initialize();
    const { id } = params;
    return await this.repo
      .createQueryBuilder("admin")
      .where("admin.id = :id", { id })
      .getOne();
  }

  async findAll() {
    await this.initialize();
    return await this.repo.find({});
  }

  async deleteByID(params: { id: number }): Promise<ResultDelete> {
    await this.initialize();
    const { id } = params;
    const { affected } = await this.repo.delete({ id });
    return {
      wasRemoved: affected === 1,
    };
  }
}

export const repoAdmins = new RepoAdmins();
