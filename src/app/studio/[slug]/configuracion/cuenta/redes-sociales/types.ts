export interface Plataforma {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    color: string;
    icono: string;
    urlBase: string;
    orden: number;
}

export interface RedSocial {
    id: string;
    projectId: string;
    plataformaId: string | null;
    url: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    plataforma?: Plataforma | null;
}

export interface NuevaRed {
    plataformaId: string;
    url: string;
}
