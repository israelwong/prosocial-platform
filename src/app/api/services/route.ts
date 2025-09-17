import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const services = await prisma.platform_services.findMany({
            orderBy: [
                { posicion: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Error al obtener los servicios' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Nombre y slug son requeridos' },
                { status: 400 }
            );
        }

        // Obtener la siguiente posición disponible
        const lastService = await prisma.platform_services.findFirst({
            orderBy: { posicion: 'desc' }
        });
        const nextPosition = (lastService?.posicion || 0) + 1;

        const service = await prisma.platform_services.create({
            data: {
                name,
                slug,
                description: description || null,
                posicion: nextPosition,
                active: true
            }
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                { error: 'Ya existe un servicio con ese nombre o slug' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Error al crear el servicio' },
            { status: 500 }
        );
    }
}
