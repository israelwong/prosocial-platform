import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const stages = await prisma.proSocialPipelineStage.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                orden: 'asc'
            }
        });

        return NextResponse.json(stages);
    } catch (error) {
        console.error('Error fetching pipeline stages:', error);
        return NextResponse.json(
            { error: 'Error al cargar las etapas del pipeline' },
            { status: 500 }
        );
    }
}
