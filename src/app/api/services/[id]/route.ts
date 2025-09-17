import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const service = await prisma.platform_services.findUnique({
            where: { id }
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Servicio no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { error: 'Error al obtener el servicio' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, slug, description, posicion, active } = body;

        const service = await prisma.platform_services.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(description !== undefined && { description }),
                ...(posicion !== undefined && { posicion }),
                ...(active !== undefined && { active }),
                updatedAt: new Date()
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                { error: 'Ya existe un servicio con ese nombre o slug' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Error al actualizar el servicio' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        await prisma.platform_services.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el servicio' },
            { status: 500 }
        );
    }
}
