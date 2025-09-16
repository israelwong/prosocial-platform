import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plataformas = await prisma.prosocial_plataformas_publicidad.findMany({
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
