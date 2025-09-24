export interface Plataforma {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    baseUrl: string;
    order: number;
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
