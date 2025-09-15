import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;

        const canal = await prisma.prosocial_canales_adquisicion.update({
            where: { id },
            data: body
        });

        return NextResponse.json(canal);
    } catch (error) {
        console.error('Error updating canal:', error);
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

        await prisma.prosocial_canales_adquisicion.delete({
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
