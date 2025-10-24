import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'DIARIO_CONTABLE', schema:'CONTABILIDAD'})
export class LibroDiario {
    
  @PrimaryGeneratedColumn({ name: 'ID_DIARIO', type: 'int' })
    id!: number;

  @Column({ name: 'FECHA', type: 'date' })
    fecha!: Date;

  @Column({ name: 'DESCRIPCION', length: 255 })
    descripcion!: string;

  @Column({ name: 'DEBE', type: 'number', precision: 10, scale: 2 })
    debe!: number;

  @Column({ name: 'HABER', type: 'number', precision: 10, scale: 2 })
    haber!: number;

  @Column({ name: 'CUENTA_CONTABLE', length: 20 })
    cuentaContable!: string;
}
