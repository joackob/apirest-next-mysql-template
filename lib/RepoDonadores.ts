import { DataSource, Repository } from "typeorm";
import { Donador } from "./entity/Donador";
import { ResultDelete, ResultSave, ResultUpdate } from "./types/TypesResult";

export class RepoDonadores {
  private repo: Repository<Donador>;
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
      entities: [Donador],
      subscribers: [],
      migrations: [],
    });

    this.repo = this.dataSource.getRepository(Donador);
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

  private async findByEmailOrDNI(email: string, dni: string) {
    return await this.repo
      .createQueryBuilder("donor")
      .where("donor.email = :email", { email })
      .orWhere("donor.dni = :dni", { dni })
      .getOne();
  }

  async save(params: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
  }): Promise<Donador> {
    await this.initialize();
    const { email, dni } = params;
    const donorFound = await this.findByEmailOrDNI(email, dni);
    return donorFound
      ? await this.repo.save({ ...donorFound, ...params })
      : await this.repo.save(params);
  }

  async updateByID(params: {
    id: string;
    nombre?: string;
    apellido?: string;
    dni?: string;
    email?: string;
    telefono?: string;
  }): Promise<ResultUpdate> {
    await this.initialize();
    const { id, ...data } = params;
    const { affected } = await this.repo
      .createQueryBuilder()
      .update()
      .set(data)
      .where("id = :id", { id })
      .execute();
    return {
      wasUpdated: affected === 1,
    };
  }

  async findByID(params: { id: string }) {
    await this.initialize();
    const { id } = params;
    return await this.repo
      .createQueryBuilder("donor")
      .where("donor.id = :id", { id })
      .getOne();
  }

  async findAll() {
    await this.initialize();
    const admins = await this.repo.find({});
    return admins;
  }

  async deleteByID(params: { id: string }): Promise<ResultDelete> {
    await this.initialize();
    const { id } = params;
    const { affected } = await this.repo
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
    return {
      wasRemoved: affected === 1,
    };
  }
}

export const repoDonadores = new RepoDonadores();
