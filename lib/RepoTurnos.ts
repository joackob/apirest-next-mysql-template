import { DataSource, MetadataAlreadyExistsError, Repository } from "typeorm";
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
    fecha: Date;
  }) {
    await this.initialize();

    /*
    Se tienen que respetar las siguientes precondiciones
    El horario para reservar debe estar disponible.
    Si el donador ya existe en el sistema, se reusa sino se recrea.
    Si el mismo donador ya reservo fecha para el dia de la fecha,
    entonces se actualiza el turno, no se crea uno nuevo
    */

    const donorFound = await this.repoDonors
      .createQueryBuilder("donor")
      .where("donor.email = :email", { email: params.email })
      .orWhere("donor.dni = :dni", { dni: params.dni })
      .getOne();

    const donor =
      donorFound ??
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

  async reserveByDonorID(params: { donorId: string; date: string }) {
    await this.initialize();
    const donor = await this.repoDonors.findOne({
      where: {
        id: params.donorId,
      },
    });

    const turn = donor
      ? await this.repoTurns.save({
          fecha: params.date,
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

  async getBooked(params: { date: Date }) {
    const { date } = params;
    const turns = await this.repoTurns
      .createQueryBuilder("turn")
      .where("year(turn.fecha) = :year", {
        year: date.getFullYear(),
      })
      .andWhere("month(turn.fecha) = :month", {
        month: date.getMonth() + 1,
      })
      .andWhere("day(turn.fecha) = :day", {
        day: date.getDate(),
      })
      .getMany();
    return turns;
  }

  async getAvailable(params: { date: Date }) {
    const DURATION_SESSION_IN_HOURS = 2;
    const NUMBER_OF_DONORS_BY_SESSION = 3;
    const SCHEDULE_FIRST_SESSION = 8;
    const SCHEDULE_LAST_SESSION = 17;
    const NUMBER_OF_SESSIONS = Math.floor(
      (SCHEDULE_LAST_SESSION - SCHEDULE_FIRST_SESSION) /
        DURATION_SESSION_IN_HOURS
    );

    const turns = new Array<{
      schedule: number;
      bucket: number;
    }>(NUMBER_OF_SESSIONS);

    turns.fill({
      schedule: SCHEDULE_FIRST_SESSION,
      bucket: NUMBER_OF_DONORS_BY_SESSION,
    });

    turns.forEach((turn, index) => {
      turn.schedule += index * DURATION_SESSION_IN_HOURS;
    });

    const turnsBooked = (await this.getBooked({ date: params.date })).map(
      (turn) => {
        const hour = turn.fecha.getHours();
        return { schedule: hour };
      }
    );

    turnsBooked.forEach((turn) => {
      const getBucket = (n: number) =>
        Math.floor((n - SCHEDULE_FIRST_SESSION) / DURATION_SESSION_IN_HOURS);
      turns[getBucket(turn.schedule)].bucket -= 1;
    });

    const possibleShifts = turns.filter((turn) => turn.bucket > 0);
    const turnsAvailable = possibleShifts.map((turn) => {
      const date = new Date(params.date);
      date.setHours(turn.schedule);
      date.setMinutes(0);
      date.setSeconds(0);
      return date;
    });
    return turnsAvailable;
  }
}

export const repoTurnos = new RepoTurnos();
