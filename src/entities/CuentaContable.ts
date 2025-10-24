import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'CUENTA_CONTABLE', schema: 'CONTABILIDAD' })
export class CuentaContable {
  @PrimaryGeneratedColumn({ name: 'ID_CUENTA', type: 'int' })
    id!: number;

  @Column({ name: 'CODIGO', type: 'varchar', length: 20, unique: true })
    codigo!: string;

  @Column({ name: 'NOMBRE', type: 'varchar', length: 100 })
    nombre!: string;

  @Column({ name: 'TIPO', type: 'varchar', length: 20 })
    tipo!: 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'GASTO';

  @Column({ name: 'NATURALEZA', type: 'varchar', length: 10 })
    naturaleza!: 'DEUDORA' | 'ACREEDORA';

  @Column({ name: 'ESTADO', type: 'varchar', length: 10, default: () => `'ACTIVO'` })
    estado!: 'ACTIVO' | 'INACTIVO';

  @Column({ name: 'ID_CENTRO_COSTO', type: 'int', nullable: true })
    idCentroCosto!: number | null;
}
