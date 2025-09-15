import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const isActive = searchParams.get('isActive');

        const where: any = {};
        
        if (status) {
            where.status = status;
        }
        
        if (isActive !== null) {
            where.isActive = isActive === 'true';
        }

        const campanas = await prisma.proSocialCampaña.findMany({
            where,
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                },
                _count: {
                    select: {
                        leads: true
                    }
                }
            },
            orderBy: [
                { fechaInicio: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(campanas);
    } catch (error) {
        console.error('Error fetching campanas:', error);
        return NextResponse.json(
            { error: 'Error al cargar las campañas' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const { plataformas, ...campañaData } = body;
        
        const campaña = await prisma.proSocialCampaña.create({
            data: {
                ...campañaData,
                plataformas: {
                    create: plataformas?.map((p: any) => ({
                        plataformaId: p.plataformaId,
                        presupuesto: p.presupuesto,
                        gastoReal: p.gastoReal || 0,
                        leads: p.leads || 0,
                        conversiones: p.conversiones || 0
                    })) || []
                }
            },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });

        return NextResponse.json(campaña, { status: 201 });
    } catch (error) {
        console.error('Error creating campaña:', error);
        return NextResponse.json(
            { error: 'Error al crear la campaña' },
            { status: 500 }
        );
    }
}
