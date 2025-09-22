import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/database/retry-helper';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const project = await prisma.projects.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                address: true,
                website: true,
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

        if (!project) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            );
        }

        // Transformar los datos para que coincidan con la interfaz del frontend
        const contactoData = {
            direccion: project.address || '',
            website: project.website || ''
        };

        const telefonos = project.telefonos.map(tel => ({
            id: tel.id,
            numero: tel.numero,
            tipo: tel.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
            activo: tel.activo,
            createdAt: tel.createdAt,
            updatedAt: tel.updatedAt
        }));

        return NextResponse.json({
            contactoData,
            telefonos
        });

    } catch (error) {
        console.error('Error fetching contacto data:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { field, value } = body;

        if (!field || !['direccion', 'website'].includes(field)) {
            return NextResponse.json(
                { error: 'Campo inválido' },
                { status: 400 }
            );
        }

        // Mapear los campos del frontend a los campos de la base de datos
        const dbField = field === 'direccion' ? 'address' : 'website';

        const updatedProject = await withRetry(async () => {
            return await prisma.projects.update({
                where: { slug },
                data: {
                    [dbField]: value,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    address: true,
                    website: true
                }
            });
        });

        if (!updatedProject) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                direccion: updatedProject.address || '',
                website: updatedProject.website || ''
            }
        });

    } catch (error) {
        console.error('Error updating contacto data:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
