// Tipos para perfiles profesionales
export interface ProfessionalProfile {
    id: string;
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
    _count?: {
        userProfiles: number;
    };
}

export interface ProfessionalProfileStats {
    totalPerfiles: number;
    perfilesActivos: number;
    perfilesPorDefecto: number;
    perfilesPersonalizados: number;
    asignacionesPorPerfil: Array<{
        id: string;
        name: string;
        count: number;
    }>;
}

export interface ProfessionalProfileForm {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive: boolean;
    order: number;
}

export interface ProfessionalProfileFilters {
    isActive?: boolean;
    isDefault?: boolean;
    search?: string;
}
