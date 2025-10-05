// Tipos para la configuración de precios del studio

export interface ConfiguracionPreciosData {
    id: string;
    nombre: string;
    slug: string;
    utilidad_servicio: string;
    utilidad_producto: string;
    comision_venta: string;
    sobreprecio: string;
}

export interface ServiciosExistentes {
    total_servicios: number;
    servicios_por_tipo: {
        servicios: number;
        productos: number;
        paquetes: number;
    };
    requiere_actualizacion_masiva: boolean;
}

export interface EstadisticasServicios {
    total_servicios: number;
    servicios_por_tipo: {
        servicios: number;
        productos: number;
        paquetes: number;
    };
    precio_promedio: number;
    utilidad_promedio: number;
}

export interface ConfiguracionPreciosUpdate {
    utilidad_servicio: string;
    utilidad_producto: string;
    comision_venta: string;
    sobreprecio: string;
}

export interface ResultadoActualizacion {
    success: boolean;
    servicios_actualizados?: number;
    requiere_actualizacion_masiva?: boolean;
    error?: string | Error;
}
