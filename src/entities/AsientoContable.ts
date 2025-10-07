import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity({ name: 'ASIENTO_CONTABLE', schema: 'CONTABILIDAD' })
export class AsientoContable {
  @PrimaryGeneratedColumn({ name: 'ID_ASIENTO', type: 'int' })
    id!: number;

  @Column({ name: 'NUMERO_ASIENTO', type: 'varchar', length: 20, unique: true })
    numeroAsiento!: string;

  @Column({ name: 'ID_EMPRESA', type: 'int' })
    idEmpresa!: number;

  @Column({ name: 'ID_PERIODO', type: 'int' })
    idPeriodo!: number;

  @Column({ name: 'ID_USUARIO', type: 'int' })
    idUsuario!: number;

  @Column({ name: 'FECHA', type: 'date' })
    fecha!: Date;

  @Column({ name: 'DESCRIPCION', type: 'varchar', length: 200 })
    descripcion!: string;

  @Column({ name: 'REFERENCIA', type: 'varchar', length: 50, nullable: true })
    referencia!: string | null;

  @Column({ name: 'TIPO', type: 'varchar', length: 20 })
    tipo!: 'APERTURA' | 'CIERRE' | 'OPERATIVA' | 'AJUSTE' | 'REGULARIZACION' | 'SIMPLE' | 'COMPUESTA';

  @Column({ name: 'ESTADO', type: 'varchar', length: 15, default: () => `'BORRADOR'` })
    estado!: 'BORRADOR' | 'CONTABILIZADO' | 'ANULADO';

  @Column({ name: 'TOTAL_DEBITO', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalDebito!: number;

  @Column({ name: 'TOTAL_CREDITO', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalCredito!: number;
}