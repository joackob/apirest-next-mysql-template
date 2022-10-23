import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  apellido!: string;

  @Column({ nullable: false, unique: true })
  email!: string;
}
