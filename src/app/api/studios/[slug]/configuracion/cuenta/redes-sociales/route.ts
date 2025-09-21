import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRetry, getFriendlyErrorMessage } from '@/lib/database/retry-helper';

// GET - Obtener redes sociales del studio
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Obtener el studio por slug
        const studio = await withRetry(async () => {
            return await prisma.projects.findUnique({
                where: { slug },
                select: { id: true, name: true }
            });
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Obtener redes sociales del studio con información de la plataforma
        const redesSociales = await withRetry(async () => {
            return await prisma.project_redes_sociales.findMany({
                where: { projectId: studio.id },
                include: {
                    plataforma: true
                },
                orderBy: { createdAt: 'asc' }
            });
        });

        return NextResponse.json(redesSociales);
    } catch (error) {
        console.error('Error fetching redes sociales:', error);
        return NextResponse.json(
            { error: getFriendlyErrorMessage(error) },
            { status: 500 }
        );
    }
}

// POST - Crear nueva red social
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { plataformaId, url, activo = true } = body;

        // Validar datos requeridos
        if (!plataformaId || !url) {
            return NextResponse.json(
                { error: 'Plataforma y URL son requeridos' },
                { status: 400 }
            );
        }

        // Validar URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'URL inválida' },
                { status: 400 }
            );
        }

        // Obtener el studio
        const studio = await withRetry(async () => {
            return await prisma.projects.findUnique({
                where: { slug },
                select: { id: true }
            });
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Verificar si ya existe una red social activa de la misma plataforma
        const existingRed = await withRetry(async () => {
            return await prisma.project_redes_sociales.findFirst({
                where: {
                    projectId: studio.id,
                    plataformaId,
                    activo: true
                }
            });
        });

        if (existingRed) {
            return NextResponse.json(
                { error: `Ya tienes una red social activa de esta plataforma` },
                { status: 400 }
            );
        }

        // Crear la red social
        const nuevaRedSocial = await withRetry(async () => {
            return await prisma.project_redes_sociales.create({
                data: {
                    projectId: studio.id,
                    plataformaId,
                    url,
                    activo
                },
                include: {
                    plataforma: true
                }
            });
        });

        return NextResponse.json(nuevaRedSocial, { status: 201 });
    } catch (error) {
        console.error('Error creating red social:', error);
        return NextResponse.json(
            { error: getFriendlyErrorMessage(error) },
            { status: 500 }
        );
    }
}

// PUT - Actualizar múltiples redes sociales
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { redesSociales } = body;

        if (!Array.isArray(redesSociales)) {
            return NextResponse.json(
                { error: 'redesSociales debe ser un array' },
                { status: 400 }
            );
        }

        // Obtener el studio
        const studio = await withRetry(async () => {
            return await prisma.projects.findUnique({
                where: { slug },
                select: { id: true }
            });
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Validar todas las URLs
        for (const red of redesSociales) {
            if (red.url) {
                try {
                    new URL(red.url);
                } catch {
                    return NextResponse.json(
                        { error: `URL inválida para ${red.plataforma}` },
                        { status: 400 }
                    );
                }
            }
        }

        // Actualizar todas las redes sociales en una transacción
        const resultados = await withRetry(async () => {
            return await prisma.$transaction(
                redesSociales.map(red =>
                    prisma.project_redes_sociales.update({
                        where: { id: red.id },
                        data: {
                            url: red.url,
                            activo: red.activo
                        }
                    })
                )
            );
        });

        return NextResponse.json(resultados);
    } catch (error) {
        console.error('Error updating redes sociales:', error);
        return NextResponse.json(
            { error: getFriendlyErrorMessage(error) },
            { status: 500 }
        );
    }
}
