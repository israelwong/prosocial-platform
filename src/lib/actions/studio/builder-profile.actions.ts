"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { BuilderProfileData } from "@/types/builder-profile";

/**
 * Get complete studio data for builder preview
 * Single query strategy - same as public profile
 * Fetches all data needed for builder sections
 */
export async function getBuilderProfileData(studioSlug: string) {
    try {
        console.log('🔍 [getBuilderProfileData] Fetching builder data for slug:', studioSlug);

        return await retryDatabaseOperation(async () => {
            // Single query to get all builder data (same strategy as public profile)
            const studio = await prisma.studios.findUnique({
                where: {
                    slug: studioSlug,
                    is_active: true
                },
                select: {
                    id: true,
                    studio_name: true,
                    description: true,
                    keywords: true,
                    logo_url: true,
                    slogan: true,
                    website: true,
                    address: true,
                    plan_id: true,
                    // Social networks for footer
                    social_networks: {
                        where: { is_active: true },
                        include: {
                            platform: {
                                select: {
                                    id: true,
                                    name: true,
                                    icon: true,
                                }
                            }
                        },
                        orderBy: { order: 'asc' }
                    },
                    // Phones for contact section
                    phones: {
                        where: { is_active: true },
                        select: {
                            id: true,
                            number: true,
                            type: true,
                        },
                        orderBy: { order: 'asc' }
                    },
                    // Items for catalog section
                    items: {
                        where: { status: 'active' },
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            cost: true,
                            order: true,
                        },
                        take: 50,
                        orderBy: { order: 'asc' }
                    },
                    // Portfolios for posts section
                    portfolios: {
                        where: { is_published: true },
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            description: true,
                            cover_image_url: true,
                            category: true,
                            order: true,
                            items: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    image_url: true,
                                    video_url: true,
                                    item_type: true,
                                    order: true,
                                },
                                orderBy: { order: 'asc' }
                            }
                        },
                        orderBy: { order: 'asc' }
                    },
                    plan: {
                        select: {
                            name: true,
                            slug: true,
                        }
                    },
                    zonas_trabajo: {
                        select: {
                            id: true,
                            nombre: true,
                            orden: true,
                        },
                        orderBy: { orden: 'asc' }
                    }
                }
            });

            if (!studio) {
                console.log('❌ [getBuilderProfileData] Studio not found:', studioSlug);
                return {
                    success: false,
                    error: 'Studio not found'
                };
            }

            // Transform data to match builder needs
            const builderData: BuilderProfileData = {
                // Studio identity data
                studio: {
                    id: studio.id,
                    studio_name: studio.studio_name,
                    description: studio.description,
                    keywords: studio.keywords,
                    logo_url: studio.logo_url,
                    slogan: studio.slogan,
                    website: studio.website,
                    address: studio.address,
                    plan_id: studio.plan_id,
                    plan: studio.plan,
                    zonas_trabajo: studio.zonas_trabajo,
                },
                // Social networks for footer
                socialNetworks: studio.social_networks.map(network => ({
                    id: network.id,
                    url: network.url,
                    platform: network.platform,
                    order: network.order,
                })),
                // Contact info
                contactInfo: {
                    phones: studio.phones.map(phone => ({
                        id: phone.id,
                        number: phone.number,
                        type: phone.type,
                    })),
                    address: studio.address,
                    website: studio.website,
                },
                // Catalog items
                items: studio.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    type: item.type as 'PRODUCTO' | 'SERVICIO',
                    cost: item.cost,
                    order: item.order,
                })),
                // Portfolios
                portfolios: studio.portfolios.map(portfolio => ({
                    id: portfolio.id,
                    title: portfolio.title,
                    slug: portfolio.slug,
                    description: portfolio.description,
                    cover_image_url: portfolio.cover_image_url,
                    category: portfolio.category,
                    order: portfolio.order,
                    items: portfolio.items.map(item => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        image_url: item.image_url,
                        video_url: item.video_url,
                        item_type: item.item_type as 'PHOTO' | 'VIDEO',
                        order: item.order,
                    })),
                })),
            };

            console.log('✅ [getBuilderProfileData] Builder data fetched successfully');
            console.log('📊 [getBuilderProfileData] Data summary:', {
                studio: builderData.studio.studio_name,
                socialNetworks: builderData.socialNetworks.length,
                phones: builderData.contactInfo.phones.length,
                items: builderData.items.length,
                portfolios: builderData.portfolios.length,
                zonas_trabajo: builderData.studio.zonas_trabajo?.length || 0,
            });
            console.log('🔍 Builder studio.zonas_trabajo:', builderData.studio.zonas_trabajo);
            console.log('🔍 Builder studio.zonas_trabajo type:', typeof builderData.studio.zonas_trabajo);
            console.log('🔍 Builder studio.zonas_trabajo is array:', Array.isArray(builderData.studio.zonas_trabajo));

            return {
                success: true,
                data: builderData,
            };
        });

    } catch (error) {
        console.error('❌ [getBuilderProfileData] Error:', error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: 'An unexpected error occurred while fetching builder data',
        };
    }
}
