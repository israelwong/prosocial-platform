import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const plataformas = await prisma.proSocialPlataformaPublicidad.findMany({
            where: {
                isActive: true
            },
            orderBy: [
                { tipo: 'asc' },
                { orden: 'asc' }
            ]
        });

        return NextResponse.json(plataformas);
    } catch (error) {
        console.error('Error fetching plataformas:', error);
        return NextResponse.json(
            { error: 'Error al cargar las plataformas' },
            { status: 500 }
        );
    }
}
