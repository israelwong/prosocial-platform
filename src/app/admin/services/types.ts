// Tipos para el sistema de servicios de la plataforma
export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    posicion: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateServiceData {
    name: string;
    slug: string;
    description?: string;
}

export interface UpdateServiceData {
    name?: string;
    slug?: string;
    description?: string;
    posicion?: number;
    active?: boolean;
}
