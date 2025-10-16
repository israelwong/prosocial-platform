export interface IdentidadData {
    id: string;
    studio_name: string;
    slug: string;
    slogan: string | null;
    descripcion: string | null;
    palabras_clave: string[];
    logo_url: string | null;
    pagina_web?: string | null;
}

export interface IdentidadUpdate {
    nombre: string;
    slogan?: string;
    descripcion?: string;
    palabras_clave?: string;
    logo_url?: string;
    pagina_web?: string;
}

export interface PalabrasClaveUpdate {
    palabras_clave: string[];
}

export interface LogoUpdate {
    tipo: "logo";
    url?: string;
}
