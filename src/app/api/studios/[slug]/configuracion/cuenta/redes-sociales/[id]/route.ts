import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener red social específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;

        // Obtener el studio
        const studio = await prisma.projects.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Obtener la red social específica
        const redSocial = await prisma.project_redes_sociales.findFirst({
            where: {
                id,
                projectId: studio.id
            },
            include: {
                plataforma: true
            }
        });

        if (!redSocial) {
            return NextResponse.json(
                { error: 'Red social not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(redSocial);
    } catch (error) {
        console.error('Error fetching red social:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar red social específica
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;
        const body = await request.json();
        const { url, activo } = body;

        // Obtener el studio
        const studio = await prisma.projects.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Verificar que la red social existe y pertenece al studio
        const redSocialExistente = await prisma.project_redes_sociales.findFirst({
            where: {
                id,
                projectId: studio.id
            }
        });

        if (!redSocialExistente) {
            return NextResponse.json(
                { error: 'Red social not found' },
                { status: 404 }
            );
        }

        // Validar URL si se proporciona
        if (url) {
            try {
                new URL(url);
            } catch {
                return NextResponse.json(
                    { error: 'URL inválida' },
                    { status: 400 }
                );
            }
        }

        // Actualizar la red social
        const redSocialActualizada = await prisma.project_redes_sociales.update({
            where: { id },
            data: {
                ...(url && { url }),
                ...(activo !== undefined && { activo })
            },
            include: {
                plataforma: true
            }
        });

        return NextResponse.json(redSocialActualizada);
    } catch (error) {
        console.error('Error updating red social:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar red social
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;

        // Obtener el studio
        const studio = await prisma.projects.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!studio) {
            return NextResponse.json(
                { error: 'Studio not found' },
                { status: 404 }
            );
        }

        // Verificar que la red social existe y pertenece al studio
        const redSocialExistente = await prisma.project_redes_sociales.findFirst({
            where: {
                id,
                projectId: studio.id
            }
        });

        if (!redSocialExistente) {
            return NextResponse.json(
                { error: 'Red social not found' },
                { status: 404 }
            );
        }

        // Eliminar la red social
        await prisma.project_redes_sociales.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Red social eliminada exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting red social:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
