export interface CuentaBancaria {
    id: string;
    projectId: string;
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string; // 'corriente' | 'ahorro' en la base de datos
    titular: string;
    activo: boolean;
    esPrincipal: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CuentaBancariaCreate {
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string; // 'corriente' | 'ahorro'
    titular: string;
    activo?: boolean;
    esPrincipal?: boolean;
}

export interface CuentaBancariaUpdate {
    banco?: string;
    numeroCuenta?: string;
    tipoCuenta?: string; // 'corriente' | 'ahorro'
    titular?: string;
    activo?: boolean;
    esPrincipal?: boolean;
}

export interface CuentaBancariaStats {
    total: number;
    activas: number;
    inactivas: number;
    principales: number;
}
