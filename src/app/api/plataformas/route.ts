import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/plataformas - Obtener todas las plataformas
export async function GET(request: NextRequest) {
    try {
        const plataformas = await prisma.platform_plataformas_publicidad.findMany({
            orderBy: {
                nombre: 'asc'
            }
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

// POST /api/plataformas - Crear nueva plataforma
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, tipo, color, icono, descripcion } = body;

        // Validar campos requeridos
        if (!nombre || !tipo) {
            return NextResponse.json(
                { error: 'Nombre y tipo son requeridos' },
                { status: 400 }
            );
        }

        // Verificar si ya existe una plataforma con el mismo nombre
        const existingPlataforma = await prisma.platform_plataformas_publicidad.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                    mode: 'insensitive'
                }
            }
        });

        if (existingPlataforma) {
            return NextResponse.json(
                { error: 'Ya existe una plataforma con este nombre' },
                { status: 400 }
            );
        }

        const plataforma = await prisma.platform_plataformas_publicidad.create({
            data: {
                nombre,
                tipo,
                color,
                icono,
                descripcion,
                createdAt: new Date(),
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