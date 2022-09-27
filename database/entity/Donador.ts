import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import "reflect-metadata";

@Entity()
export class Donador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  email!: string;

  @Column()
  telefono!: string;

  @OneToMany(() => Turno, (turno) => turno.donador)
  turnos!: Turno[];
}

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp" })
  fecha!: string;

  @ManyToOne(() => Donador, (donador) => donador.turnos)
  donador!: Donador;
}
