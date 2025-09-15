import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const agents = await prisma.prosocial_agents.findMany({
            where: {
                activo: true
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                metaMensualLeads: true,
                comisionConversion: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        // Convertir Decimal a number para el frontend
        const agentsFormatted = agents.map(agent => ({
            ...agent,
            comisionConversion: Number(agent.comisionConversion)
        }));

        return NextResponse.json(agentsFormatted);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json(
            { error: 'Error al cargar los agentes' },
            { status: 500 }
        );
    }
}
