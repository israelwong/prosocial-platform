import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const canales = await prisma.platform_canales_adquisicion.findMany({
            orderBy: [
                { categoria: 'asc' },
                { orden: 'asc' }
            ]
        });

        return NextResponse.json(canales);
    } catch (error) {
        console.error('Error fetching canales:', error);
        return NextResponse.json(
            { error: 'Error al cargar los canales' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const canal = await prisma.platform_canales_adquisicion.create({
            data: body
        });

        return NextResponse.json(canal, { status: 201 });
    } catch (error) {
        console.error('Error creating canal:', error);
        return NextResponse.json(
            { error: 'Error al crear el canal' },
            { status: 500 }
        );
    }
}
