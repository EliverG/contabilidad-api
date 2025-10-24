import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "CONTABILIDAD", name: "USUARIO" })
export class User {

  @PrimaryGeneratedColumn({name: "ID_USUARIO"})
  id!: number;

  @Column({name: "USERNAME"})
  username!: string;

  @Column({name: "PASSWORD"})
  password!: string;

  @Column({name: "NOMBRE"})
  nombre!: string;

  @Column({name: "EMAIL"})
  email!: string;

  @Column({name: "ROL"})
  rol!: string;

  @Column({name: 'ESTADO'})
  estado!: string;
}