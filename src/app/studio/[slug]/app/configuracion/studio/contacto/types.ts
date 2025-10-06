export interface Telefono {
    id: string;
    studio_id: string;
    numero: string;
    tipo: 'principal' | 'whatsapp' | 'emergencia' | 'oficina';
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TelefonoCreate {
    numero: string;
    tipo: 'principal' | 'whatsapp' | 'emergencia' | 'oficina';
    activo?: boolean;
}

export interface TelefonoUpdate {
    numero?: string;
    tipo?: 'principal' | 'whatsapp' | 'emergencia' | 'oficina';
    activo?: boolean;
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
