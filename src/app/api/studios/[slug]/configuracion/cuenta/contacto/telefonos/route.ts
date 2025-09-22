import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/database/retry-helper';

// GET - Obtener todos los teléfonos del proyecto
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const project = await withRetry(async () => {
            return await prisma.projects.findUnique({
                where: { slug },
                select: {
                    id: true,
                    telefonos: {
                        select: {
                            id: true,
                            numero: true,
                            tipo: true,
                            activo: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            });
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            );
        }

        // Transformar los datos para que coincidan con la interfaz del frontend
        const telefonos = project.telefonos.map(tel => ({
            id: tel.id,
            numero: tel.numero,
            tipo: tel.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
            activo: tel.activo,
            createdAt: tel.createdAt,
            updatedAt: tel.updatedAt
        }));

        return NextResponse.json({ telefonos });

    } catch (error) {
        console.error('Error fetching telefonos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// POST - Crear nuevo teléfono
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { numero, tipo, activo = true } = body;

        if (!numero || !tipo) {
            return NextResponse.json(
                { error: 'Número y tipo son requeridos' },
                { status: 400 }
            );
        }

        // Validar tipo
        const tiposValidos = ['principal', 'whatsapp', 'emergencia', 'oficina'];
        if (!tiposValidos.includes(tipo)) {
            return NextResponse.json(
                { error: 'Tipo de teléfono inválido' },
                { status: 400 }
            );
        }

        // Obtener el proyecto
        const project = await withRetry(async () => {
            return await prisma.projects.findUnique({
                where: { slug },
                select: { id: true }
            });
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            );
        }

        // Crear el teléfono
        const nuevoTelefono = await withRetry(async () => {
            return await prisma.project_telefonos.create({
                data: {
                    projectId: project.id,
                    numero,
                    tipo,
                    activo
                },
                select: {
                    id: true,
                    numero: true,
                    tipo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        });

        // Transformar para el frontend
        const telefono = {
            id: nuevoTelefono.id,
            numero: nuevoTelefono.numero,
            tipo: nuevoTelefono.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
            activo: nuevoTelefono.activo,
            createdAt: nuevoTelefono.createdAt,
            updatedAt: nuevoTelefono.updatedAt
        };

        return NextResponse.json({
            success: true,
            telefono
        });

    } catch (error) {
        console.error('Error creating telefono:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
