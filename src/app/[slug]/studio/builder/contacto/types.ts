export interface Telefono {
    id?: string;
    numero: string;
    tipo: 'llamadas' | 'whatsapp' | 'ambos';
    etiqueta?: string; // ej: "Principal", "Emergencias"
    is_active?: boolean; // Estado activo/inactivo
}

export interface Horario {
    id?: string;
    dia: string;
    apertura: string;
    cierre: string;
    cerrado: boolean;
    order?: number;
}

export interface ZonaTrabajo {
    id?: string;
    nombre: string;
    color?: string; // para los badges (opcional)
}

export interface ContactoData {
    id: string;
    studio_id: string;
    descripcion: string;
    direccion: string;
    google_maps_url: string;
    horarios: Horario[];
    telefonos: Telefono[];
    zonas_trabajo: ZonaTrabajo[];
}

export interface ContactoFormData {
    descripcion: string;
    direccion: string;
    google_maps_url: string;
    telefonos: Telefono[];
    horarios: Horario[];
    zonas_trabajo: ZonaTrabajo[];
}
