import { DataSource, Repository } from "typeorm";
import { Turno } from "./entity/Turno";
import { Donador } from "./entity/Donador";

type ResultReserve = {
  reserved: boolean;
  donorID?: string;
  turnID?: string;
};

export class RepoTurnos {
  private repoTurns: Repository<Turno>;
  private repoDonors: Repository<Donador>;
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
      entities: [Donador, Turno],
      subscribers: [],
      migrations: [],
    });

    this.repoTurns = this.dataSource.getRepository(Turno);
    this.repoDonors = this.dataSource.getRepository(Donador);
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

  async reserve(params: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    fecha: string;
  }) {
    await this.initialize();
    const resultSearch = await this.repoDonors
      .createQueryBuilder("donor")
      .where("donor.email = :email", { email: params.email })
      .orWhere("donor.dni = :dni", { dni: params.dni })
      .getOne();

    const donor =
      resultSearch ??
      (await this.repoDonors.save({
        nombre: params.nombre,
        apellido: params.apellido,
        dni: params.dni,
        email: params.email,
        telefono: params.telefono,
      }));

    const turn = await this.repoTurns.save({
      fecha: params.fecha,
      donador: donor,
    });

    const result: ResultReserve = {
      reserved: true,
      donorID: donor.id,
      turnID: turn.id,
    };

    return result;
  }

  async reserveByDonorID(params: { donorId: string; fecha: string }) {
    await this.initialize();
    const donor = await this.repoDonors.findOne({
      where: {
        id: params.donorId,
      },
    });

    const turn = donor
      ? await this.repoTurns.save({
          fecha: params.fecha,
          donador: donor,
        })
      : null;

    const result: ResultReserve = {
      reserved: turn ? true : false,
      donorID: donor?.id,
      turnID: turn?.id,
    };

    return result;
  }
}

export const repoTurnos = new RepoTurnos();
