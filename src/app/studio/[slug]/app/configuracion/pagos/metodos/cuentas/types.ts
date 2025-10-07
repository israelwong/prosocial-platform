export interface CuentaBancariaData {
    id: string;
    banco: string;
    numeroCuenta: string;
    titular: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CuentaBancariaFormData {
    banco: string;
    numeroCuenta: string;
    titular: string;
    activo: boolean;
}