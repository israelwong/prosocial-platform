export interface Horario {
    id: string;
    studio_id: string;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface HorarioCreate {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    activo?: boolean;
}

export interface HorarioUpdate {
    dia_semana?: string;
    hora_inicio?: string;
    hora_fin?: string;
    activo?: boolean;
}

export const DIAS_SEMANA = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
] as const;
