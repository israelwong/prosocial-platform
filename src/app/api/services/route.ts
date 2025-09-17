import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const services = await prisma.platform_services.findMany({
            where: {
                active: true
            },
            orderBy: {
                name: 'asc'
            }
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

        const service = await prisma.platform_services.create({
            data: {
                name,
                slug,
                description: description || null,
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
