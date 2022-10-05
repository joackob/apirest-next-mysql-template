import { DataSource, Repository } from "typeorm";
import { Administrador } from "./entity/Administrador";

type ResultUpdate = {
  updated: boolean;
};

type ResultDelete = {
  removed: boolean;
};

type ResultSave = {
  id: string;
};

export class RepoAdmin {
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

  async save(params: { nombre: string; apellido: string; email: string }) {
    await this.initialize();
    const resultSearch = await this.repo
      .createQueryBuilder("admin")
      .where("admin.email = :email", { email: params.email })
      .getOne();
    const admin = resultSearch ?? (await this.repo.save(params));
    const result: ResultSave = {
      id: admin.id,
    };
    return result;
  }

  async update(params: {
    id: string;
    nombre?: string;
    apellido?: string;
    email?: string;
  }) {
    await this.initialize();
    const res = await this.repo.update({ id: params.id }, params);
    const affected: ResultUpdate = {
      updated: res.affected === 1,
    };

    return affected;
  }

  async destroy() {
    await this.initialize();
    await this.dataSource.destroy();
    return this;
  }

  async find(params: { id: string }) {
    await this.initialize();
    const admin = await this.repo.findOne({
      where: {
        id: params.id,
      },
    });

    return admin;
  }

  async findAll() {
    await this.initialize();
    const admins = await this.repo.find({});
    return admins;
  }

  async delete(params: { id: string }) {
    await this.initialize();
    const res = await this.repo.delete({
      id: params.id,
    });
    const affected: ResultDelete = {
      removed: res.affected === 1,
    };

    return affected;
  }
}

export const repoAdmin = new RepoAdmin();
