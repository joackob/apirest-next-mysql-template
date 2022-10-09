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

  async save(params: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
  }) {
    await this.initialize();
    const { email, dni } = params;
    const donorFound = await this.repo
      .createQueryBuilder("donor")
      .where("donor.email = :email", { email })
      .orWhere("donor.dni = :dni", { dni })
      .getOne();

    const updateDonor = async (id: string) => {
      await this.updateByID({ id, ...params });
      return id;
    };

    const saveDonor = async () => {
      const donor = await this.repo.save(params);
      return donor.id;
    };

    const result: ResultSave = {
      id: donorFound ? await updateDonor(donorFound.id) : await saveDonor(),
    };
    return result;
  }

  async destroy() {
    await this.initialize();
    await this.dataSource.destroy();
    return this;
  }

  async updateByID(params: {
    id: string;
    nombre?: string;
    apellido?: string;
    dni?: string;
    email?: string;
    telefono?: string;
  }) {
    await this.initialize();
    const { id, ...data } = params;
    const res = await this.repo
      .createQueryBuilder()
      .update()
      .set(data)
      .where("id = :id", { id })
      .execute();
    const affected: ResultUpdate = {
      updated: res.affected === 1,
    };

    return affected;
  }

  async findByID(params: { id: string }) {
    await this.initialize();
    const { id } = params;
    const donor = await this.repo.findOne({
      where: {
        id,
      },
    });

    return donor;
  }

  async findAll() {
    await this.initialize();
    const admins = await this.repo.find({});
    return admins;
  }

  async deleteByID(params: { id: string }) {
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

export const repoDonadores = new RepoDonadores();
