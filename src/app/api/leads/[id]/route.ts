import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const lead = await prisma.proSocialLead.findUnique({
            where: { id },
            include: {
                agent: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                etapa: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                },
                canalAdquisicion: {
                    select: {
                        id: true,
                        nombre: true,
                        categoria: true,
                        color: true,
                        icono: true
                    }
                },
                campaña: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                bitacora: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10 // Últimas 10 entradas
                }
            }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        return NextResponse.json(
            { error: 'Error al cargar el lead' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar campos requeridos
        if (!body.nombre || !body.email || !body.telefono) {
            return NextResponse.json(
                { error: 'Nombre, email y teléfono son requeridos' },
                { status: 400 }
            );
        }

        // Verificar que el lead existe
        const existingLead = await prisma.proSocialLead.findUnique({
            where: { id }
        });

        if (!existingLead) {
            return NextResponse.json(
                { error: 'Lead no encontrado' },
                { status: 404 }
            );
        }

        // Verificar que el email no esté en uso por otro lead
        if (body.email !== existingLead.email) {
            const emailExists = await prisma.proSocialLead.findUnique({
                where: { email: body.email }
            });

            if (emailExists) {
                return NextResponse.json(
                    { error: 'Ya existe un lead con este email' },
                    { status: 400 }
                );
            }
        }

        const updatedLead = await prisma.proSocialLead.update({
            where: { id },
            data: {
                nombre: body.nombre,
                email: body.email,
                telefono: body.telefono,
                nombreEstudio: body.nombreEstudio || null,
                slugEstudio: body.slugEstudio || null,
                planInteres: body.planInteres || null,
                presupuestoMensual: body.presupuestoMensual || null,
                fechaProbableInicio: body.fechaProbableInicio || null,
                agentId: body.agentId || null,
                etapaId: body.etapaId || null,
                canalAdquisicionId: body.canalAdquisicionId || null,
                puntaje: body.puntaje || null,
                prioridad: body.prioridad || 'media',
                fechaUltimoContacto: new Date() // Actualizar fecha de último contacto
            },
            include: {
                agent: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                etapa: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                },
                canalAdquisicion: {
                    select: {
                        id: true,
                        nombre: true,
                        categoria: true,
                        color: true,
                        icono: true
                    }
                }
            }
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error('Error updating lead:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el lead' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar que el lead existe
        const existingLead = await prisma.proSocialLead.findUnique({
            where: { id }
        });

        if (!existingLead) {
            return NextResponse.json(
                { error: 'Lead no encontrado' },
                { status: 404 }
            );
        }

        await prisma.proSocialLead.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Lead eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting lead:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el lead' },
            { status: 500 }
        );
    }
}
