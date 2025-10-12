// ============================================
// BUILDER PROFILE TYPES
// ============================================
// Types for studio builder preview data
// Used in studio builder sections

export interface BuilderStudioProfile {
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
}

export interface BuilderSocialNetwork {
    id: string;
    url: string;
    platform: {
        id: string;
        name: string;
        icon: string | null;
    } | null;
    order: number;
}

export interface BuilderContactInfo {
    phones: {
        id: string;
        number: string;
        type: string;
    }[];
    address: string | null;
    website: string | null;
}

export interface BuilderCatalogItem {
    id: string;
    name: string;
    type: 'PRODUCTO' | 'SERVICIO';
    cost: number;
    order: number;
}

export interface BuilderPortfolioItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    video_url: string | null;
    item_type: 'PHOTO' | 'VIDEO';
    order: number;
}

export interface BuilderPortfolio {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    category: string | null;
    order: number;
    items: BuilderPortfolioItem[];
}

export interface BuilderProfileData {
    studio: BuilderStudioProfile;
    socialNetworks: BuilderSocialNetwork[];
    contactInfo: BuilderContactInfo;
    items: BuilderCatalogItem[];
    portfolios: BuilderPortfolio[];
}
