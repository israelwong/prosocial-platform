export interface IdentidadData {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  descripcion: string | null;
  palabras_clave: string[];
  logoUrl: string | null;
  isotipo_url: string | null;
}

export interface IdentidadUpdate {
  nombre: string;
  slogan?: string;
  descripcion?: string;
  palabras_clave?: string;
  logoUrl?: string;
  isotipo_url?: string;
}

export interface PalabrasClaveUpdate {
  palabras_clave: string[];
}

export interface LogoUpdate {
  tipo: "logo" | "isotipo";
  url?: string;
}
