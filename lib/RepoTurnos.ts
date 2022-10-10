import { Brackets, DataSource, Repository } from "typeorm";
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
  wasReserved: boolean;
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
  private async findByDateAndDonorID(date: string, id: string) {
    return await this.repoTurns
      .createQueryBuilder("turn")
      .leftJoinAndSelect("turn.donador", "donador")
      .where("date(turn.fecha) = :date", { date })
      .andWhere("turn.donador.id = :id", { id })
      .getOne();
  }

  async reserve(params: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    fecha: Date;
  }): Promise<ResultReserve> {
    await this.initialize();
    const { fecha, ...donorData } = params;
    const donor = await this.repoDonors.save(donorData);
    const date = fecha.toISOString().slice(0, 10);
    const turnFound = await this.findByDateAndDonorID(date, donor.id);
    const { id } = turnFound
      ? await this.repoTurns.save({ ...turnFound, fecha, donador: donor })
      : await this.repoTurns.save({ fecha, donador: donor });

    return {
      turnID: id,
      donorID: donor.id,
      wasReserved: true,
    };
  }

  /* Regresa todos los turnos que fueron reservados en una fecha determianda */
  async getBooked(params: { date: Date }) {
    await this.initialize();
    const date = params.date.toISOString().slice(0, 10);
    return await this.repoTurns
      .createQueryBuilder("turn")
      .leftJoinAndSelect("turn.donador", "donador")
      .where("date(turn.fecha) = :date", { date })
      .getMany();
  }

  /* Regresa todos los turnos que posibles en una fecha determianda */
  private getPossible(params: { date: Date }) {
    const turns = Array<Turno>(NUMBER_OF_SESSIONS)
      .fill(new Turno())
      .map((_, index) => {
        const turn = new Turno();
        turn.fecha = new Date(params.date);
        turn.fecha.setHours(
          SCHEDULE_FIRST_SESSION + index * DURATION_SESSION_IN_HOURS
        );
        return turn;
      });
    return turns;
  }

  /* Regresa todos los turnos que libres en una fecha determianda */
  private groupTurnsByHour(turns: Turno[]) {
    const numberShiftsHour = new Map<number, number>();
    turns.forEach(({ fecha }) => {
      const hours = fecha.getHours();
      const count = numberShiftsHour.get(hours) ?? 0;
      numberShiftsHour.set(hours, count + 1);
    });
    return numberShiftsHour;
  }

  async getAvailable(params: { date: Date }) {
    await this.initialize();
    const turnsPossible = this.getPossible(params);
    const turnsBooked = await this.getBooked(params);
    const numberShiftsHour = this.groupTurnsByHour([
      ...turnsPossible,
      ...turnsBooked,
    ]);
    const turnAvailable = new Array<Turno>();
    numberShiftsHour.forEach((count, hour) => {
      if (count <= NUMBER_OF_DONORS_BY_SESSION) {
        const turn = new Turno();
        const date = new Date(params.date);
        date.setHours(hour, 0, 0);
        turn.fecha = date;
        turnAvailable.push(turn);
      }
    });
    return turnAvailable;
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

  async deleteByID(params: { id: string }): Promise<ResultDelete> {
    await this.initialize();
    const { id } = params;
    const { affected } = await this.repoTurns
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
    return {
      wasRemoved: affected === 1,
    };
  }

  async updateByID(params: { id: string; date: Date }): Promise<ResultUpdate> {
    await this.initialize();
    const { id, date } = params;
    const { affected } = await this.repoTurns
      .createQueryBuilder()
      .update()
      .set({ fecha: date })
      .where("id = :id", { id })
      .execute();
    return {
      wasUpdated: affected === 1,
    };
  }
}

export const repoTurnos = new RepoTurnos();
