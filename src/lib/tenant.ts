import { createContext, useContext } from "react";
import { Studio, Plan } from "@prisma/client";

// Usar los tipos generados por Prisma
type StudioWithPlan = Studio & {
    plan: Plan;
    _count?: {
        projects: number;
    };
};

interface TenantContextType {
    studio: StudioWithPlan | null;
    isLoading: boolean;
    canCreateProject: boolean;
    projectsRemaining: number;
}

export const TenantContext = createContext<TenantContextType>({
    studio: null,
    isLoading: true,
    canCreateProject: false,
    projectsRemaining: 0,
});

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error("useTenant must be used within a TenantProvider");
    }
    return context;
};

export async function getStudioBySlug(
    slug: string
): Promise<StudioWithPlan | null> {
    try {
        const { prisma } = await import("@/lib/db");

        const studio = await prisma.studio.findUnique({
            where: { slug },
            include: {
                plan: true,
                _count: {
                    select: {
                        projects: {
                            where: {
                                status: "ACTIVE",
                            },
                        },
                    },
                },
            },
        });

        return studio as StudioWithPlan;
    } catch (error) {
        console.error("Error fetching studio:", error);
        return null;
    }
}
