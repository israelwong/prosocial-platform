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

export interface CreateServiceCategoryData {
    name: string;
    description: string;
    icon: string;
    posicion?: number;
    active?: boolean;
}

export interface UpdateServiceCategoryData {
    name?: string;
    description?: string;
    icon?: string;
    posicion?: number;
    active?: boolean;
}
