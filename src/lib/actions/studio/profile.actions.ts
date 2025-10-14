"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Tipo específico para el resultado de la query de Prisma
export type StudioProfileResult = {
    id: string;
    slug: string;
    studio_name: string;
    logo_url: string | null;
    isotipo_url: string | null;
    slogan: string | null;
    description: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    phones: Array<{
        id: string;
        number: string;
        type: string;
        order: number;
    }>;
    business_hours: Array<{
        id: string;
        day_of_week: string;
        start_time: string;
        end_time: string;
    }>;
    social_networks: Array<{
        id: string;
        url: string;
        platform: {
            name: string;
        } | null;
    }>;
};

export const getStudioPublicProfile = cache(async (slug: string): Promise<StudioProfileResult | null> => {
    try {
        const studio = await prisma.studios.findUnique({
            where: {
                slug,
                is_active: true,
            },
            select: {
                id: true,
                slug: true,
                studio_name: true,
                logo_url: true,
                isotipo_url: true,
                slogan: true,
                description: true,
                email: true,
                website: true,
                address: true,
                phones: {
                    where: { is_active: true },
                    orderBy: { order: "asc" },
                },
                business_hours: {
                    where: { is_active: true },
                    orderBy: { day_of_week: "asc" },
                },
                social_networks: {
                    where: { is_active: true },
                    orderBy: { order: "asc" },
                    include: {
                        platform: true,
                    },
                },
            },
        });

        if (!studio) return null;

        return studio as StudioProfileResult; // Cast to the defined type
    } catch (error) {
        console.error("Error fetching studio profile:", error);
        return null;
    }
});
