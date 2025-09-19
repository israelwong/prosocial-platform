import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/plataformas/[id] - Obtener plataforma específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const plataforma = await prisma.platform_plataformas_publicidad.findUnique({
            where: { id },
            include: {
                platform_campana_plataformas: {
                    include: {
                        platform_campanas: true
                    }
                }
            }
        });

        if (!plataforma) {
            return NextResponse.json(
                { error: 'Plataforma no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(plataforma);
    } catch (error) {
        console.error('Error fetching plataforma:', error);
        return NextResponse.json(
            { error: 'Error al cargar la plataforma' },
            { status: 500 }
        );
    }
}

// PUT /api/plataformas/[id] - Actualizar plataforma
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { nombre, tipo, color, icono, descripcion } = body;

        // Validar campos requeridos
        if (!nombre || !tipo) {
            return NextResponse.json(
                { error: 'Nombre y tipo son requeridos' },
                { status: 400 }
            );
        }

        // Verificar si la plataforma existe
        const existingPlataforma = await prisma.platform_plataformas_publicidad.findUnique({
            where: { id }
        });

        if (!existingPlataforma) {
            return NextResponse.json(
                { error: 'Plataforma no encontrada' },
                { status: 404 }
            );
        }

        // Verificar si ya existe otra plataforma con el mismo nombre
        const duplicatePlataforma = await prisma.platform_plataformas_publicidad.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                    mode: 'insensitive'
                },
                id: {
                    not: id
                }
            }
        });

        if (duplicatePlataforma) {
            return NextResponse.json(
                { error: 'Ya existe otra plataforma con este nombre' },
                { status: 400 }
            );
        }

        const plataforma = await prisma.platform_plataformas_publicidad.update({
            where: { id },
            data: {
                nombre,
                tipo,
                color,
                icono,
                descripcion,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(plataforma);
    } catch (error) {
        console.error('Error updating plataforma:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la plataforma' },
            { status: 500 }
        );
    }
}

// DELETE /api/plataformas/[id] - Eliminar plataforma
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verificar si la plataforma existe
        const existingPlataforma = await prisma.platform_plataformas_publicidad.findUnique({
            where: { id },
            include: {
                platform_campana_plataformas: true
            }
        });

        if (!existingPlataforma) {
            return NextResponse.json(
                { error: 'Plataforma no encontrada' },
                { status: 404 }
            );
        }

        // Verificar si la plataforma está siendo usada en campañas
        if (existingPlataforma.platform_campana_plataformas.length > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar una plataforma que está siendo usada en campañas' },
                { status: 400 }
            );
        }

        await prisma.platform_plataformas_publicidad.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plataforma:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la plataforma' },
            { status: 500 }
        );
    }
}
