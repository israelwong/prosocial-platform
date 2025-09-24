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
        profile: PersonnelProfile;
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
