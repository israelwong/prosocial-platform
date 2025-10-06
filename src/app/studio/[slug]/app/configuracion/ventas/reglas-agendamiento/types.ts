export interface ReglaAgendamientoData {
    id: string;
    studio_id: string;
    nombre: string;
    descripcion?: string | null;
    recurrencia: 'por_dia' | 'por_hora';
    capacidadOperativa: number; // cuántos eventos puede cubrir simultáneamente
    status: 'active' | 'inactive';
    orden: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReglaAgendamientoFormData {
    nombre: string;
    descripcion?: string;
    recurrencia: 'por_dia' | 'por_hora';
    capacidadOperativa: number;
    status: 'active' | 'inactive';
    orden: number;
}
