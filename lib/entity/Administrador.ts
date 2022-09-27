import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata";

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  email!: string;
}
