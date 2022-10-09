import { DataSource, Repository } from "typeorm";
import { Turno } from "./entity/Turno";
import { Donador } from "./entity/Donador";
import { ResultDelete, ResultUpdate } from "./types/TypesResult";
import { RepoDonadores } from "./RepoDonadores";

const DURATION_SESSION_IN_HOURS = 2;
const SCHEDULE_FIRST_SESSION = 8;
const SCHEDULE_LAST_SESSION = 17;
const NUMBER_OF_DONORS_BY_SESSION = 3;
const NUMBER_OF_SESSIONS = Math.floor(
  (SCHEDULE_LAST_SESSION - SCHEDULE_FIRST_SESSION) / DURATION_SESSION_IN_HOURS
);

export type ResultReserve = {
  reserved: boolean;
  donorID?: string;
  turnID?: string;
};

export class RepoTurnos {
  private repoTurns: Repository<Turno>;
  private repoDonors: RepoDonadores;
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
    this.repoDonors = new RepoDonadores();
  }

  async initialize() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    return this;
  }

  async destroy() {
    await this.initialize();
    await this.repoDonors.destroy();
    await this.dataSource.destroy();
    return this;
  }

  /*
    Reserva un turno para un donador. 
    El horario para reservar debe estar disponible.
    Si el donador no existe en el sistema, se crea uno nuevo.
    Si el mismo donador ya reservo turno para el dia de la fecha,
    entonces se actualiza el turno, no se crea uno nuevo
  */
  async reserve(params: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    fecha: Date;
  }) {
    await this.initialize();

    const { fecha, ...donorData } = params;

    const res = await this.repoDonors.save(donorData);
    const donor = await this.repoDonors.findByID({ id: res.id });
    const date = fecha.toISOString().slice(0, 10);
    const turnFound = await this.repoTurns
      .createQueryBuilder("turn")
      .leftJoinAndSelect("turn.donador", "donador")
      .where("date(turn.fecha) = :date", { date })
      .andWhere("turn.donador.id = :id", { id: donor?.id })
      .getOne();

    const updateTurn = async (id: string) => {
      await this.updateByID({ id, date: fecha });
      return id;
    };

    const saveTurn = async (donor: Donador) => {
      const turn = await this.repoTurns.save({
        fecha: params.fecha,
        donador: donor,
      });
      return turn.id;
    };

    const result: ResultReserve = {
      donorID: donor?.id,
      turnID: turnFound
        ? await updateTurn(turnFound.id)
        : await saveTurn(donor!),
      reserved: true,
    };

    return result;
  }

  /* Reserva un turno asociado a un donador segun su id */
  async reserveByDonorID(params: { donorId: string; date: string }) {
    await this.initialize();
    const id = params.donorId;
    const donor = await this.repoDonors.findByID({ id });

    const saveTurn = async (donor: Donador) =>
      await this.repoTurns.save({
        fecha: params.date,
        donador: donor,
      });

    const turn = donor ? await saveTurn(donor) : null;

    const result: ResultReserve = {
      reserved: turn ? true : false,
      donorID: donor?.id,
      turnID: turn?.id,
    };

    return result;
  }

  /* Regresa todos los turnos que fueron reservados en una fecha determianda */
  async getBooked(params: { date: Date }) {
    await this.initialize();
    const date = params.date.toISOString().slice(0, 10);

    const turnsBooked = await this.repoTurns
      .createQueryBuilder("turn")
      .leftJoinAndSelect("turn.donador", "donador")
      .where("date(turn.fecha) = :date", {
        date,
      })
      .getMany();

    return turnsBooked;
  }

  /* Regresa todos los turnos que posibles en una fecha determianda */
  private getPossible(params: { date: Date }) {
    const turns = Array<Turno>(NUMBER_OF_SESSIONS)
      .fill(new Turno())
      .map(() => new Turno());

    turns.forEach((turn, index) => {
      turn.fecha = new Date(params.date);
      turn.fecha.setHours(
        SCHEDULE_FIRST_SESSION + index * DURATION_SESSION_IN_HOURS
      );
    });

    return turns;
  }

  /* Regresa todos los turnos que libres en una fecha determianda */
  async getAvailable(params: { date: Date }) {
    await this.initialize();
    const date = params.date.toISOString().slice(0, 10);
    const turnsPossible = this.getPossible(params);

    const turnsBooked = await this.repoTurns
      .createQueryBuilder("turn")
      .where("date(turn.fecha) = :date", {
        date,
      })
      .getMany();

    const bucketByTurn = turnsPossible.map((turn) => ({
      turn,
      bucket: NUMBER_OF_DONORS_BY_SESSION,
    }));

    turnsBooked.forEach(({ fecha }) => {
      const bucket = Math.floor(
        (fecha.getHours() - SCHEDULE_FIRST_SESSION) / DURATION_SESSION_IN_HOURS
      );
      bucketByTurn[bucket].bucket -= 1;
    });

    const turnsAvailable = bucketByTurn
      .filter(({ bucket }) => bucket > 0)
      .map(({ turn }) => turn);

    return turnsAvailable;
  }

  async findByID(params: { id: string }) {
    await this.initialize();
    const { id } = params;
    const turn = await this.repoTurns
      .createQueryBuilder("turn")
      .leftJoinAndSelect("turn.donador", "donador")
      .where("turn.id = :id", { id })
      .getOne();

    return turn;
  }

  async deleteByID(params: { id: string }) {
    await this.initialize();
    const { id } = params;
    const res = await this.repoTurns
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();

    const affected: ResultDelete = {
      removed: res.affected === 1,
    };

    return affected;
  }

  async updateByID(params: { id: string; date: Date }) {
    await this.initialize();
    const { id, date } = params;
    const res = await this.repoTurns
      .createQueryBuilder()
      .update()
      .set({ fecha: date })
      .where("id = :id", { id })
      .execute();

    const affected: ResultUpdate = {
      updated: res.affected === 1,
    };

    return affected;
  }
}

export const repoTurnos = new RepoTurnos();
