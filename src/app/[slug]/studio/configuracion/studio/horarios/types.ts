export interface Horario {
    id: string;
    studio_id: string;
    day_of_week: string; // Actualizado: dia_semana → day_of_week
    start_time: string; // Actualizado: hora_inicio → start_time
    end_time: string; // Actualizado: hora_fin → end_time
    is_active: boolean; // Actualizado: activo → is_active
    order: number; // Agregado: campo order
    created_at: Date; // Actualizado: createdAt → created_at
    updated_at: Date; // Actualizado: updatedAt → updated_at
}

export interface HorarioCreate {
    day_of_week: string; // Actualizado: dia_semana → day_of_week
    start_time: string; // Actualizado: hora_inicio → start_time
    end_time: string; // Actualizado: hora_fin → end_time
    is_active?: boolean; // Actualizado: activo → is_active
    order?: number; // Agregado: campo order opcional
}

export interface HorarioUpdate {
    day_of_week?: string; // Actualizado: dia_semana → day_of_week
    start_time?: string; // Actualizado: hora_inicio → start_time
    end_time?: string; // Actualizado: hora_fin → end_time
    is_active?: boolean; // Actualizado: activo → is_active
    order?: number; // Agregado: campo order opcional
}

export const DIAS_SEMANA = [
    { value: 'monday', label: 'Lunes' }, // Actualizado: lunes → monday
    { value: 'tuesday', label: 'Martes' }, // Actualizado: martes → tuesday
    { value: 'wednesday', label: 'Miércoles' }, // Actualizado: miercoles → wednesday
    { value: 'thursday', label: 'Jueves' }, // Actualizado: jueves → thursday
    { value: 'friday', label: 'Viernes' }, // Actualizado: viernes → friday
    { value: 'saturday', label: 'Sábado' }, // Actualizado: sabado → saturday
    { value: 'sunday', label: 'Domingo' } // Actualizado: domingo → sunday
] as const;
