// ============================================
// CATALOGO TYPES
// ============================================
// Types para la sección de catálogo del builder
// Basado en el patrón de contacto y portafolio

export interface CatalogoItem {
    id: string;
    name: string;
    type: 'PRODUCTO' | 'SERVICIO';
    cost: number;
    order: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
}

export interface CatalogoData {
    items: CatalogoItem[];
}

export interface CatalogoItemFormData {
    name: string;
    type: 'PRODUCTO' | 'SERVICIO';
    cost: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
}

export interface CatalogoCategory {
    id: string;
    name: string;
    description?: string;
    order: number;
    items: CatalogoItem[];
}
