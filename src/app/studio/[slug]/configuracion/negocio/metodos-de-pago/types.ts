// Ruta: src/app/studio/[slug]/configuracion/negocio/metodos-pago/types.ts

export interface MetodoPagoData {
    id: string;
    studio_id: string;
    metodo_pago: string;
    comision_porcentaje_base?: number | null;
    comision_fija_monto?: number | null;
    payment_method?: string | null;
    status: string;
    orden: number | null;
    createdAt: Date;
    updatedAt: Date;
    // Campos adicionales que pueden venir de la base de datos
    comision_msi_porcentaje?: number | null;
    [key: string]: any; // Para campos adicionales no tipados
}

export interface MetodoPagoUpdate {
    id: string;
    metodo_pago: string;
    comision_porcentaje_base?: number | null;
    comision_fija_monto?: number | null;
    payment_method?: string | null;
    status: 'active' | 'inactive';
    orden: number;
}

export interface MetodoPagoFormData {
    metodo_pago: string;
    comision_porcentaje_base?: string | null;
    comision_fija_monto?: string | null;
    payment_method?: string | null;
    status: 'active' | 'inactive';
    orden: number;
}
