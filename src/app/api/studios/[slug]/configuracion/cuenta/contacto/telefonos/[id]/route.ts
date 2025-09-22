import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/database/retry-helper';

// GET - Obtener un teléfono específico
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;

        const telefono = await withRetry(async () => {
            return await prisma.project_telefonos.findFirst({
                where: {
                    id,
                    projects: { slug }
                },
                select: {
                    id: true,
                    numero: true,
                    tipo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        });

        if (!telefono) {
            return NextResponse.json(
                { error: 'Teléfono no encontrado' },
                { status: 404 }
            );
        }

        // Transformar para el frontend
        const telefonoData = {
            id: telefono.id,
            numero: telefono.numero,
            tipo: telefono.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
            activo: telefono.activo,
            createdAt: telefono.createdAt,
            updatedAt: telefono.updatedAt
        };

        return NextResponse.json({ telefono: telefonoData });

    } catch (error) {
        console.error('Error fetching telefono:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar un teléfono
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;
        const body = await request.json();
        const { numero, tipo, activo } = body;

        if (!numero || !tipo) {
            return NextResponse.json(
                { error: 'Número y tipo son requeridos' },
                { status: 400 }
            );
        }

        // Validar tipo
        const tiposValidos = ['principal', 'whatsapp', 'emergencia', 'oficina'];
        if (!tiposValidos.includes(tipo)) {
            return NextResponse.json(
                { error: 'Tipo de teléfono inválido' },
                { status: 400 }
            );
        }

        // Verificar que el teléfono existe y pertenece al proyecto
        const telefonoExistente = await withRetry(async () => {
            return await prisma.project_telefonos.findFirst({
                where: {
                    id,
                    projects: { slug }
                },
                select: { id: true }
            });
        });

        if (!telefonoExistente) {
            return NextResponse.json(
                { error: 'Teléfono no encontrado' },
                { status: 404 }
            );
        }

        // Actualizar el teléfono
        const telefonoActualizado = await withRetry(async () => {
            return await prisma.project_telefonos.update({
                where: { id },
                data: {
                    numero,
                    tipo,
                    activo,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    numero: true,
                    tipo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        });

        // Transformar para el frontend
        const telefono = {
            id: telefonoActualizado.id,
            numero: telefonoActualizado.numero,
            tipo: telefonoActualizado.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
            activo: telefonoActualizado.activo,
            createdAt: telefonoActualizado.createdAt,
            updatedAt: telefonoActualizado.updatedAt
        };

        return NextResponse.json({
            success: true,
            telefono
        });

    } catch (error) {
        console.error('Error updating telefono:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un teléfono
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; id: string }> }
) {
    try {
        const { slug, id } = await params;

        // Verificar que el teléfono existe y pertenece al proyecto
        const telefonoExistente = await withRetry(async () => {
            return await prisma.project_telefonos.findFirst({
                where: {
                    id,
                    projects: { slug }
                },
                select: { id: true }
            });
        });

        if (!telefonoExistente) {
            return NextResponse.json(
                { error: 'Teléfono no encontrado' },
                { status: 404 }
            );
        }

        // Eliminar el teléfono
        await withRetry(async () => {
            return await prisma.project_telefonos.delete({
                where: { id }
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Teléfono eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error deleting telefono:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
