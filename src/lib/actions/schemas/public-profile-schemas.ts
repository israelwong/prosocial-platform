// ============================================
// PUBLIC PROFILE SCHEMAS
// ============================================
// Zod validation schemas for public profile data
// Used in server actions for data validation

import { z } from 'zod';

// Base schemas
export const PublicStudioProfileSchema = z.object({
    id: z.string(),
    studio_name: z.string(),
    description: z.string().nullable(),
    keywords: z.string().nullable(),
    logo_url: z.string().nullable(),
    slogan: z.string().nullable(),
    website: z.string().nullable(),
    address: z.string().nullable(),
    plan_id: z.string().nullable(),
    plan: z.object({
        name: z.string(),
        slug: z.string(),
    }).nullable().optional(),
});

export const PublicSocialNetworkSchema = z.object({
    id: z.string(),
    url: z.string(),
    platform: z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string().nullable(),
    }).nullable(),
    order: z.number(),
});

export const PublicCatalogItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number().nullable(),
    image_url: z.string().nullable(),
    category: z.string().nullable(),
    order: z.number(),
});

export const PublicPortfolioItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    image_url: z.string().nullable(),
    video_url: z.string().nullable(),
    item_type: z.enum(['PHOTO', 'VIDEO']),
    order: z.number(),
});

export const PublicPortfolioSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    cover_image_url: z.string().nullable(),
    category: z.string().nullable(),
    order: z.number(),
    items: z.array(PublicPortfolioItemSchema),
});

export const PublicContactInfoSchema = z.object({
    phones: z.array(z.object({
        id: z.string(),
        number: z.string(),
        type: z.string(),
    })),
    address: z.string().nullable(),
    website: z.string().nullable(),
});

export const PublicProfileDataSchema = z.object({
    studio: PublicStudioProfileSchema,
    socialNetworks: z.array(PublicSocialNetworkSchema),
    contactInfo: PublicContactInfoSchema,
    items: z.array(PublicCatalogItemSchema),
    portfolios: z.array(PublicPortfolioSchema),
});

// Input schemas for server actions
export const GetStudioProfileInputSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});

// Output schemas for server actions
export const GetStudioProfileOutputSchema = z.object({
    success: z.boolean(),
    data: PublicProfileDataSchema.optional(),
    error: z.string().optional(),
});

// Type exports
export type PublicStudioProfileForm = z.infer<typeof PublicStudioProfileSchema>;
export type PublicSocialNetworkForm = z.infer<typeof PublicSocialNetworkSchema>;
export type PublicCatalogItemForm = z.infer<typeof PublicCatalogItemSchema>;
export type PublicPortfolioItemForm = z.infer<typeof PublicPortfolioItemSchema>;
export type PublicPortfolioForm = z.infer<typeof PublicPortfolioSchema>;
export type PublicContactInfoForm = z.infer<typeof PublicContactInfoSchema>;
export type PublicProfileDataForm = z.infer<typeof PublicProfileDataSchema>;
export type GetStudioProfileInputForm = z.infer<typeof GetStudioProfileInputSchema>;
export type GetStudioProfileOutputForm = z.infer<typeof GetStudioProfileOutputSchema>;
