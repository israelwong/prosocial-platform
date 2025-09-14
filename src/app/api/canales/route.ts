import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const canales = await prisma.proSocialCanalAdquisicion.findMany({
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
        
        const canal = await prisma.proSocialCanalAdquisicion.create({
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
