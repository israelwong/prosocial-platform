import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para crear agente
const createAgentSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(1, 'El teléfono es requerido'),
    activo: z.boolean().default(true),
    metaMensualLeads: z.number().min(1, 'La meta debe ser mayor a 0'),
    comisionConversion: z.number().min(0).max(1, 'La comisión debe estar entre 0 y 1')
});

// GET /api/admin/agents - Listar todos los agentes
export async function GET() {
    try {
        const agents = await prisma.proSocialAgent.findMany({
            include: {
                _count: {
                    select: {
                        leads: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json(
            { error: 'Error al obtener los agentes' },
            { status: 500 }
        );
    }
}

// POST /api/admin/agents - Crear nuevo agente
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar datos
        const validatedData = createAgentSchema.parse(body);

        // Verificar si el email ya existe
        const existingAgent = await prisma.proSocialAgent.findUnique({
            where: { email: validatedData.email }
        });

        if (existingAgent) {
            return NextResponse.json(
                { error: 'Ya existe un agente con este email' },
                { status: 400 }
            );
        }

        // Crear agente
        const agent = await prisma.proSocialAgent.create({
            data: {
                nombre: validatedData.nombre,
                email: validatedData.email,
                telefono: validatedData.telefono,
                activo: validatedData.activo,
                metaMensualLeads: validatedData.metaMensualLeads,
                comisionConversion: validatedData.comisionConversion
            },
            include: {
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        return NextResponse.json(agent, { status: 201 });
    } catch (error) {
        console.error('Error creating agent:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al crear el agente' },
            { status: 500 }
        );
    }
}
