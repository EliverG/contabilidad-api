import {
Entity,
PrimaryGeneratedColumn,
Column
} from 'typeorm';

@Entity({ name: 'EMPRESA', schema: 'CONTABILIDAD' })
export class Empresa {
@PrimaryGeneratedColumn({ name: 'ID_EMPRESA', type: 'int' })
    id!: number;

@Column({ name: 'NOMBRE', type: 'varchar', length: 100 })
    nombre!: string;

@Column({ name: 'DIRECCION', type: 'varchar', length: 200, nullable: true })
    direccion!: string | null;

@Column({ name: 'TELEFONO', type: 'varchar', length: 20, nullable: true })
    telefono!: string | null;

@Column({ name: 'RUC_NIT', type: 'varchar', length: 20, unique: true })
    rucNit!: string;

@Column({name: 'ESTADO',type: 'varchar',length: 10,default: () => `'ACTIVO'`})
    estado!: 'ACTIVO' | 'INACTIVO';
}
