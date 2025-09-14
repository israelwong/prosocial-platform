import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        const campaña = await prisma.proSocialCampaña.findUnique({
            where: { id },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                },
                leads: {
                    include: {
                        canalAdquisicion: true
                    }
                },
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        if (!campaña) {
            return NextResponse.json(
                { error: 'Campaña no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(campaña);
    } catch (error) {
        console.error('Error fetching campaña:', error);
        return NextResponse.json(
            { error: 'Error al cargar la campaña' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;
        
        const { plataformas, ...campañaData } = body;
        
        const campaña = await prisma.proSocialCampaña.update({
            where: { id },
            data: {
                ...campañaData,
                plataformas: plataformas ? {
                    deleteMany: {},
                    create: plataformas.map((p: any) => ({
                        plataformaId: p.plataformaId,
                        presupuesto: p.presupuesto,
                        gastoReal: p.gastoReal || 0,
                        leads: p.leads || 0,
                        conversiones: p.conversiones || 0
                    }))
                } : undefined
            },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });

        return NextResponse.json(campaña);
    } catch (error) {
        console.error('Error updating campaña:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la campaña' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        await prisma.proSocialCampaña.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting campaña:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la campaña' },
            { status: 500 }
        );
    }
}
