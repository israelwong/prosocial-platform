import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;
        
        const canal = await prisma.proSocialCanalAdquisicion.update({
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
        
        await prisma.proSocialCanalAdquisicion.delete({
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
