import React from 'react';
import { prisma } from '@/lib/prisma';
import { withRetry, getFriendlyErrorMessage } from '@/lib/database/retry-helper';
import { RedesSocialesWrapper } from './components/RedesSocialesWrapper';

interface PlataformaRedSocial {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    baseUrl: string | null;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Función para obtener las plataformas de redes sociales
async function getPlataformasRedesSociales(): Promise<PlataformaRedSocial[]> {
    try {
        // En build time, retornar array vacío para evitar errores de conexión
        if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
            return [];
        }

        const plataformas = await withRetry(async () => {
            return await prisma.platform_social_networks.findMany({
                orderBy: {
                    order: 'asc'
                }
            });
        });

        return plataformas;
    } catch (error) {
        console.error('Error fetching plataformas redes sociales:', error);
        // En build time, retornar array vacío en lugar de lanzar error
        if (process.env.NODE_ENV === 'production') {
            return [];
        }
        throw new Error(getFriendlyErrorMessage(error));
    }
}

export default async function RedesSocialesPage() {
    let plataformas: PlataformaRedSocial[] = [];
    let error: string | null = null;

    try {
        plataformas = await getPlataformasRedesSociales();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido al cargar las redes sociales';
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                {/* Error State */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-medium mb-2">Error al cargar redes sociales</h3>
                            <p className="text-red-300 text-sm mb-3">{error}</p>
                            <div className="text-red-300 text-sm space-y-1">
                                <p><strong>Posibles soluciones:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Verifica tu conexión a internet</li>
                                    <li>Confirma que el proyecto de Supabase esté activo</li>
                                    <li>Espera unos segundos y recarga la página</li>
                                    <li>Si el problema persiste, contacta al administrador</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <RedesSocialesWrapper plataformas={plataformas} />;
}
