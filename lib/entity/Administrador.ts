import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  email!: string;
}
