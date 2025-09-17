// Tipos para la gestión de servicios en planes

export enum UnidadMedida {
  BOOLEAN = 'BOOLEAN',
  CANTIDAD = 'CANTIDAD',
  HORAS = 'HORAS',
  USUARIOS = 'USUARIOS',
  CATALOGOS = 'CATALOGOS',
  GB = 'GB',
  PROYECTOS = 'PROYECTOS',
  COTIZACIONES = 'COTIZACIONES',
  LANDING_PAGES = 'LANDING_PAGES'
}

export interface PlanService {
  id: string;
  plan_id: string;
  service_id: string;
  active: boolean;
  limite: number | null; // null = ilimitado, 0 = sin acceso
  unidad: UnidadMedida | null;
  createdAt: Date;
  updatedAt: Date;
  service: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    posicion: number;
    active: boolean;
  };
}

export interface ServiceWithPlanConfig {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  posicion: number;
  active: boolean;
  planService?: PlanService | null;
}

export interface CreatePlanServiceData {
  plan_id: string;
  service_id: string;
  active: boolean;
  limite?: number | null;
  unidad?: UnidadMedida | null;
}

export interface UpdatePlanServiceData {
  active?: boolean;
  limite?: number | null;
  unidad?: UnidadMedida | null;
}

// Mapeo de unidades de medida para mostrar en UI
export const UNIDAD_MEDIDA_LABELS: Record<UnidadMedida, string> = {
  [UnidadMedida.BOOLEAN]: 'Sí/No',
  [UnidadMedida.CANTIDAD]: 'Cantidad',
  [UnidadMedida.HORAS]: 'Horas',
  [UnidadMedida.USUARIOS]: 'Usuarios',
  [UnidadMedida.CATALOGOS]: 'Catálogos',
  [UnidadMedida.GB]: 'GB',
  [UnidadMedida.PROYECTOS]: 'Proyectos',
  [UnidadMedida.COTIZACIONES]: 'Cotizaciones',
  [UnidadMedida.LANDING_PAGES]: 'Landing Pages'
};

// Función helper para obtener el label de una unidad
export function getUnidadLabel(unidad: UnidadMedida | null): string {
  return unidad ? UNIDAD_MEDIDA_LABELS[unidad] : 'Sin unidad';
}

// Función helper para formatear el límite
export function formatLimite(limite: number | null, unidad: UnidadMedida | null): string {
  if (limite === null) return 'Ilimitado';
  if (limite === 0) return 'Sin acceso';
  return `${limite} ${getUnidadLabel(unidad).toLowerCase()}`;
}
