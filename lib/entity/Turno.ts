import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Donador } from "./Donador";

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp", nullable: false })
  fecha!: Date;

  @ManyToOne(() => Donador, {
    onDelete: "CASCADE",
  })
  donador!: Donador;
}
