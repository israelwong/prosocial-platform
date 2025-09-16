import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;

        // Validar datos requeridos
        if (body.nombre && !body.nombre.trim()) {
            return NextResponse.json(
                { error: 'El nombre del canal es requerido' },
                { status: 400 }
            );
        }

        // Preparar datos para actualizar
        const updateData = {
            ...body,
            updatedAt: new Date()
        };

        const canal = await prisma.platform_canales_adquisicion.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(canal);
    } catch (error) {
        console.error('Error updating canal:', error);
        
        // Manejar errores específicos de Prisma
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            
            if (error.message.includes('Unique constraint') || error.message.includes('duplicate key')) {
                return NextResponse.json(
                    { error: 'Ya existe un canal con este nombre' },
                    { status: 409 }
                );
            }
            if (error.message.includes('Record to update not found')) {
                return NextResponse.json(
                    { error: 'Canal no encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Error al actualizar el canal' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.platform_canales_adquisicion.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting canal:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el canal' },
            { status: 500 }
        );
    }
}
