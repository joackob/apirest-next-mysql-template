import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Donador {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  apellido!: string;

  @Column({ nullable: false, unique: true })
  dni!: string;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: false })
  telefono!: string;
}
