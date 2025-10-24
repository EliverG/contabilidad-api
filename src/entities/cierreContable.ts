import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "CONTABILIDAD", name: "CIERRE_CONTABLE" })
export class CierreContable {
  @PrimaryGeneratedColumn({ name: "ID_CIERRE" })
  id!: number;

  @Column({ name: "ID_PERIODO", nullable: false })
  idPeriodo!: number;

  @Column({ name: "ID_USUARIO", nullable: false })
  idUsuario!: number;

  @Column({ name: "FECHA_CIERRE", type: "date", nullable: false })
  fechaCierre!: Date;

  @Column({ name: "TIPO", nullable: false })
  tipo!: "MENSUAL" | "ANUAL";

  @Column({ name: "ESTADO", nullable: false })
  estado!: "VALIDO" | "CON_ERRORES";

  @Column({ name: "TOTAL_DEBITO", type: "decimal", precision: 15, scale: 2, default: 0, nullable: false })
  totalDebito!: number;

  @Column({ name: "TOTAL_CREDITO", type: "decimal", precision: 15, scale: 2, default: 0, nullable: false })
  totalCredito!: number;

  // Cambiar text -> clob para Oracle
  @Column({ name: "ERRORES", type: "clob", nullable: true })
  errores!: string | null;
}