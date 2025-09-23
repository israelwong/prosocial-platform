// Ruta: src/app/studio/[slug]/configuracion/negocio/metodos-pago/types.ts

export interface MetodoPagoData {
    id: string;
    projectId: string;
    metodo_pago: string;
    comision_porcentaje_base?: number | null;
    comision_fija_monto?: number | null;
    payment_method?: string | null;
    tipo: 'manual' | 'stripe_automatico' | 'msi';
    requiere_stripe: boolean;
    status: 'active' | 'inactive';
    orden: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MetodoPagoUpdate {
    id: string;
    metodo_pago: string;
    comision_porcentaje_base?: number | null;
    comision_fija_monto?: number | null;
    payment_method?: string | null;
    tipo: 'manual' | 'stripe_automatico' | 'msi';
    requiere_stripe: boolean;
    status: 'active' | 'inactive';
    orden: number;
}

export interface MetodoPagoFormData {
    metodo_pago: string;
    comision_porcentaje_base?: string | null;
    comision_fija_monto?: string | null;
    payment_method?: string | null;
    tipo: 'manual' | 'stripe_automatico' | 'msi';
    requiere_stripe: boolean;
    status: 'active' | 'inactive';
    orden: number;
}
