import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        const campaña = await prisma.prosocial_campanas.findUnique({
            where: { id },
            include: {
                prosocial_campana_plataformas: {
                    include: {
                        prosocial_plataformas_publicidad: true
                    }
                },
                prosocial_leads: {
                    include: {
                        prosocial_canales_adquisicion: true
                    }
                },
                _count: {
                    select: {
                        prosocial_leads: true
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
        
        const campaña = await prisma.prosocial_campanas.update({
            where: { id },
            data: {
                ...campañaData,
                prosocial_campana_plataformas: plataformas ? {
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
                prosocial_campana_plataformas: {
                    include: {
                        prosocial_plataformas_publicidad: true
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
        
        await prisma.prosocial_campanas.delete({
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
