import type { PersonnelType, PersonnelProfile } from '@/lib/actions/schemas/personal-schemas';

export interface Personal {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    type: PersonnelType | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    professional_profiles: Array<{
        id: string;
        profile: {
            id: string;
            name: string;
            slug: string;
            color: string | null;
            icon: string | null;
            description: string | null;
            projectId: string;
            isActive: boolean;
            isDefault: boolean;
            order: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        description: string | null;
        isActive: boolean;
    }>;
}

export interface PersonalStats {
    totalEmpleados: number;
    totalProveedores: number;
    totalPersonal: number;
    totalActivos: number;
    totalInactivos: number;
    perfilesProfesionales: Record<string, number>;
}
