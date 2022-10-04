import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

@Entity()
export class Donador {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  apellido!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false })
  telefono!: string;
}
