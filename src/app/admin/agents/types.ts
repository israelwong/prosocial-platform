// Tipos compartidos para el sistema de agentes
export interface Agent {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    activo: boolean;
    metaMensualLeads: number;
    comisionConversion: number;
    createdAt: Date;
    _count: {
        prosocial_leads: number;
    };
}

export interface AuthStatus {
    exists: boolean;
    user?: {
        id: string;
        email: string;
        last_sign_in_at?: string;
        created_at?: string;
        ban_duration?: string;
    };
    is_active: boolean;
}
