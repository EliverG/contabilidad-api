export interface CuentaBalance {
  codigo: string;
  nombreCuenta: string;
  saldo: number;
}

export interface BalanceGeneral {
  empresaId: number;
  periodoId: number;
  fechaGeneracion: string;
  activos: CuentaBalance[];
  pasivos: CuentaBalance[];
  patrimonio: CuentaBalance[];
  totalActivos: number;
  totalPasivos: number;
  totalPatrimonio: number;
}
