import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para actualizar agente
const updateAgentSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').optional(),
    email: z.string().email('Email inválido').optional(),
    telefono: z.string().min(1, 'El teléfono es requerido').optional(),
    activo: z.boolean().optional(),
    metaMensualLeads: z.number().min(1, 'La meta debe ser mayor a 0').optional(),
    comisionConversion: z.number().min(0).max(1, 'La comisión debe estar entre 0 y 1').optional()
});

// GET /api/admin/agents/[id] - Obtener agente por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const agent = await prisma.proSocialAgent.findUnique({
            where: { id },
            include: {
                leads: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        etapa: true,
                        prioridad: true,
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        if (!agent) {
            return NextResponse.json(
                { error: 'Agente no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(agent);
    } catch (error) {
        console.error('Error fetching agent:', error);
        return NextResponse.json(
            { error: 'Error al obtener el agente' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/agents/[id] - Actualizar agente
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validar datos
        const validatedData = updateAgentSchema.parse(body);

        // Verificar si el agente existe
        const existingAgent = await prisma.proSocialAgent.findUnique({
            where: { id }
        });

        if (!existingAgent) {
            return NextResponse.json(
                { error: 'Agente no encontrado' },
                { status: 404 }
            );
        }

        // Si se está actualizando el email, verificar que no exista otro agente con ese email
        if (validatedData.email && validatedData.email !== existingAgent.email) {
            const emailExists = await prisma.proSocialAgent.findUnique({
                where: { email: validatedData.email }
            });

            if (emailExists) {
                return NextResponse.json(
                    { error: 'Ya existe un agente con este email' },
                    { status: 400 }
                );
            }
        }

        // Actualizar agente
        const agent = await prisma.proSocialAgent.update({
            where: { id },
            data: validatedData,
            include: {
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        return NextResponse.json(agent);
    } catch (error) {
        console.error('Error updating agent:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al actualizar el agente' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/agents/[id] - Eliminar agente
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Verificar si el agente existe
        const existingAgent = await prisma.proSocialAgent.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        if (!existingAgent) {
            return NextResponse.json(
                { error: 'Agente no encontrado' },
                { status: 404 }
            );
        }

        // Verificar si tiene leads asignados
        if (existingAgent._count.leads > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar un agente que tiene leads asignados' },
                { status: 400 }
            );
        }

        // Eliminar agente
        await prisma.proSocialAgent.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Agente eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting agent:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el agente' },
            { status: 500 }
        );
    }
}
