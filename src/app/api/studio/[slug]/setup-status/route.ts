// src/app/api/studio/[slug]/setup-status/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = await params;

        // Obtener studio por slug
        const studio = await prisma.studios.findUnique({
            where: { slug },
            select: { id: true, studio_name: true, slug: true }
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio no encontrado' },
                { status: 404 }
            );
        }

        // Estado de configuración simplificado
        const setupStatus = {
            studio: {
                id: studio.id,
                name: studio.studio_name,
                slug: studio.slug
            },
            overallProgress: 25, // Simulado
            isFullyConfigured: false,
            sections: [
                {
                    id: 'estudio_identidad',
                    name: 'Identidad del Estudio',
                    status: 'in_progress',
                    completionPercentage: 50,
                    completedFields: ['studio_name', 'slug'],
                    missingFields: ['logo_url', 'descripcion'],
                    errors: [],
                    completedAt: null,
                    lastUpdatedAt: new Date()
                },
                {
                    id: 'estudio_contacto',
                    name: 'Información de Contacto',
                    status: 'pending',
                    completionPercentage: 0,
                    completedFields: [],
                    missingFields: ['phone', 'email', 'address'],
                    errors: [],
                    completedAt: null,
                    lastUpdatedAt: new Date()
                }
            ],
            lastValidatedAt: new Date()
        };

        return NextResponse.json({
            success: true,
            data: setupStatus
        });
    } catch (error) {
        console.error('Error getting setup status:', error);

        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = await params;

        // Obtener studio por slug
        const studio = await prisma.studios.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Estado de configuración actualizado',
            data: {
                overallProgress: 25,
                isFullyConfigured: false,
                lastValidatedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error updating setup status:', error);

        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
