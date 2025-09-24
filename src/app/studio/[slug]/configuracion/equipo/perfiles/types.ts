export interface ProfessionalProfile {
    id: string;
    projectId: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    isDefault: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfessionalProfileStats {
    totalPerfiles: number;
    perfilesActivos: number;
    totalInactivos: number;
    asignacionesPorPerfil: Record<string, number>;
}

export interface ProfessionalProfileCreateForm {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
    order?: number;
}

export interface ProfessionalProfileUpdateForm {
    id: string;
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
    order?: number;
}