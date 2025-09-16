import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const canales = await prisma.platform_canales_adquisicion.findMany({
            orderBy: [
                { categoria: 'asc' },
                { orden: 'asc' }
            ]
        });

        return NextResponse.json(canales);
    } catch (error) {
        console.error('Error fetching canales:', error);
        return NextResponse.json(
            { error: 'Error al cargar los canales' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar datos requeridos
        if (!body.nombre || !body.nombre.trim()) {
            return NextResponse.json(
                { error: 'El nombre del canal es requerido' },
                { status: 400 }
            );
        }

        if (!body.categoria || !body.categoria.trim()) {
            return NextResponse.json(
                { error: 'La categoría del canal es requerida' },
                { status: 400 }
            );
        }

        // Preparar datos para crear
        const canalData = {
            nombre: body.nombre.trim(),
            descripcion: body.descripcion?.trim() || null,
            categoria: body.categoria.trim(),
            color: body.color || '#3B82F6',
            icono: body.icono || null,
            isActive: body.isActive ?? true,
            isVisible: body.isVisible ?? true,
            orden: body.orden || 0
        };

        const canal = await prisma.platform_canales_adquisicion.create({
            data: canalData
        });

        return NextResponse.json(canal, { status: 201 });
    } catch (error) {
        console.error('Error creating canal:', error);
        
        // Manejar errores específicos de Prisma
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    { error: 'Ya existe un canal con este nombre' },
                    { status: 409 }
                );
            }
            if (error.message.includes('Invalid value')) {
                return NextResponse.json(
                    { error: 'Los datos proporcionados no son válidos' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Error al crear el canal. Por favor, verifica los datos e intenta nuevamente.' },
            { status: 500 }
        );
    }
}
