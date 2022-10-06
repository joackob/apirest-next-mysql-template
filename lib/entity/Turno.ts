import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Donador } from "./Donador";

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "timestamp", nullable: false })
  fecha!: string;

  @ManyToOne(() => Donador, {
    onDelete: "CASCADE",
  })
  donador!: Donador;
}
