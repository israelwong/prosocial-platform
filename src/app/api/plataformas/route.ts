import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plataformas = await prisma.platform_plataformas_publicidad.findMany({
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const plataforma = await prisma.platform_plataformas_publicidad.create({
            data: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                tipo: body.tipo,
                color: body.color,
                icono: body.icono,
                isActive: body.isActive !== false,
                orden: body.orden || 0,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(plataforma, { status: 201 });
    } catch (error) {
        console.error('Error creating plataforma:', error);
        return NextResponse.json(
            { error: 'Error al crear la plataforma' },
            { status: 500 }
        );
    }
}
