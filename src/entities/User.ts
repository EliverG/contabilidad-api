import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "PAYROLL_PAYMENT_USR", name: "USER_TEST" })
export class User {

  @PrimaryGeneratedColumn({name: "ID"})
  id!: number;

  @Column({name: "FIRSTNAME"})
  firstName!: string;

  @Column({name: "LASTNAME"})
  lastName!: string;

  @Column({name: 'AGE'})
  age!: number;
}