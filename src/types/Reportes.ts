export interface MovimientoContableDetallado {
  fecha: string | number | Date;
  numeroAsiento: string;
  codigoCuenta: string;
  nombreCuenta: string;
  descripcionMovimiento?: string;
  descripcionAsiento?: string;
  debito: number;
  credito: number;
  centroCosto?: {
    codigo: string;
    nombre: string;
  };
  proyecto?: {
    codigo: string;
    nombre: string;
  };
}

export interface ReporteDetallado {
  empresaId: number;
  periodoId: number;
  fechaGeneracion: string;
  asientos: MovimientoContableDetallado[];
}

export interface MovimientoContableSeccion {
  fecha: string | number | Date;
  numeroAsiento: string;
  codigoCuenta: string;
  nombreCuenta: string;
  descripcionMovimiento?: string;
  descripcionAsiento?: string;
  debito: number;
  credito: number;
  centroCosto?: string;
  proyecto?: string;
}

export interface ReporteSeccion {
  empresaId: number;
  periodoId: number;
  seccion: 'ACTIVO' | 'PASIVO' | 'PATRIMONIO';
  fechaGeneracion: string;
  movimientos: MovimientoContableSeccion[];
}
