import {
Entity,
PrimaryGeneratedColumn,
Column,
} from 'typeorm';

@Entity({ name: 'PERIODO_CONTABLE', schema: 'CONTABILIDAD' })
export class PeriodoContable {
@PrimaryGeneratedColumn({ name: 'ID_PERIODO', type: 'int' })
id!: number;

@Column({ name: 'ID_EMPRESA', type: 'int' })
idEmpresa!: number;

@Column({ name: 'NOMBRE_PERIODO', type: 'varchar', length: 50 })
nombrePeriodo!: string;

@Column({ name: 'FECHA_INICIO', type: 'date' })
fechaInicio!: Date;

@Column({ name: 'FECHA_FIN', type: 'date' })
fechaFin!: Date;

@Column({
name: 'ESTADO',
type: 'varchar',
length: 10,
default: () => `'ABIERTO'`
})
estado!: 'ABIERTO' | 'CERRADO';
}
