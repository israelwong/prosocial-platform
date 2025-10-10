export interface Telefono {
    id: string;
    studio_id: string;
    number: string; // Actualizado: numero → number
    type: string; // Actualizado: tipo → type
    is_active: boolean; // Actualizado: activo → is_active
    order: number;
    created_at: Date;
    updated_at: Date;
}

export interface TelefonoCreate {
    number: string; // Actualizado: numero → number
    type: 'principal' | 'whatsapp' | 'emergencia' | 'oficina'; // Actualizado: tipo → type
    is_active?: boolean; // Actualizado: activo → is_active
}

export interface TelefonoUpdate {
    number?: string; // Actualizado: numero → number
    type?: 'principal' | 'whatsapp' | 'emergencia' | 'oficina'; // Actualizado: tipo → type
    is_active?: boolean; // Actualizado: activo → is_active
}

export interface ContactoData {
    direccion: string;
    website: string;
}

export interface ContactoUpdate {
    direccion?: string;
    website?: string;
}

export const TIPOS_TELEFONO = [
    { value: 'principal', label: 'Principal', color: 'bg-blue-500' },
    { value: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500' },
    { value: 'emergencia', label: 'Emergencia', color: 'bg-red-500' },
    { value: 'oficina', label: 'Oficina', color: 'bg-zinc-500' }
] as const;
