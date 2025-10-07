// Tipos para el sistema de servicios de la plataforma
export interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    posicion: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    posicion: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: ServiceCategory;
}

export interface ServiceWithCategory extends Service {
    category: ServiceCategory;
}

export interface CreateServiceData {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
}

export interface UpdateServiceData {
    name?: string;
    slug?: string;
    description?: string;
    categoryId?: string;
    posicion?: number;
    active?: boolean;
}
