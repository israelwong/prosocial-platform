// ============================================
// PUBLIC PROFILE TYPES
// ============================================
// Types for public-facing studio profile pages
// Used in /[slug] route for public studio profiles

export interface PublicZonaTrabajo {
    id: string;
    nombre: string;
    orden: number;
}

export interface PublicStudioProfile {
    id: string;
    studio_name: string;
    description: string | null;
    keywords: string | null;
    logo_url: string | null;
    slogan: string | null;
    website: string | null;
    address: string | null;
    plan_id: string | null;
    plan?: {
        name: string;
        slug: string;
    } | null;
    zonas_trabajo?: PublicZonaTrabajo[];
}

export interface PublicSocialNetwork {
    id: string;
    url: string;
    platform: {
        id: string;
        name: string;
        icon: string | null;
    } | null;
    order: number;
}

export interface PublicCatalogItem {
    id: string;
    name: string;
    type: 'PRODUCTO' | 'SERVICIO';
    cost: number;
    order: number;
}

export interface PublicPortfolioItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    video_url: string | null;
    item_type: 'PHOTO' | 'VIDEO';
    order: number;
}

export interface PublicPortfolio {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    category: string | null;
    order: number;
    items: PublicPortfolioItem[];
}

export interface PublicContactInfo {
    phones: {
        id: string;
        number: string;
        type: string;
    }[];
    address: string | null;
    website: string | null;
    google_maps_url: string | null;
}

export enum ProfileTab {
    POSTS = 'posts',
    SHOP = 'shop',
    INFO = 'info'
}

export interface PublicProfileData {
    studio: PublicStudioProfile;
    socialNetworks: PublicSocialNetwork[];
    contactInfo: PublicContactInfo;
    items: PublicCatalogItem[];
    portfolios: PublicPortfolio[];
}

// Stats for hardcoded demo values
export interface ProfileStats {
    postsCount: number;
    followersCount: string; // "31.5k" format
}

// Action button types
export interface ContactAction {
    type: 'call' | 'message' | 'schedule';
    label: string;
    href?: string;
    onClick?: () => void;
}

// Social link types
export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    label: string;
}
