import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const agents = await prisma.proSocialAgent.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                especialidad: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json(
            { error: 'Error al cargar los agentes' },
            { status: 500 }
        );
    }
}
