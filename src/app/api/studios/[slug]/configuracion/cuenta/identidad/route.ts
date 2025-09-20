import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateStudio, validateRequiredFields } from '@/lib/studio-auth';

// GET - Obtener información de identidad del studio
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Autenticar studio
        const authResult = await authenticateStudio(request, slug);
        if (authResult.error) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { studio } = authResult;

        // Obtener información de identidad del studio
        const identidad = await prisma.projects.findUnique({
            where: { id: studio!.id },
            select: {
                name: true,
                slogan: true,
                descripcion: true,
                palabras_clave: true,
                logoUrl: true,
                isotipo_url: true
            }
        });

        // Parsear palabras clave si existen
        let palabrasClave = [];
        if (identidad?.palabras_clave) {
            try {
                palabrasClave = JSON.parse(identidad.palabras_clave);
            } catch {
                palabrasClave = [];
            }
        }

        return NextResponse.json({
            ...identidad,
            palabras_clave: palabrasClave
        });
    } catch (error) {
        console.error('Error fetching identidad:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar información de identidad del studio
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const {
            name,
            slogan,
            descripcion,
            palabras_clave,
            logoUrl,
            isotipo_url
        } = body;

        // Autenticar studio
        const authResult = await authenticateStudio(request, slug);
        if (authResult.error) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const { studio } = authResult;

        // Validar datos requeridos
        const validation = validateRequiredFields(body, ['name']);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Validar que el nombre no esté vacío
        if (!name.trim()) {
            return NextResponse.json(
                { error: 'El nombre del estudio es requerido' },
                { status: 400 }
            );
        }

        // Validar URLs si se proporcionan
        if (logoUrl && !logoUrl.startsWith('http')) {
            return NextResponse.json(
                { error: 'URL del logo inválida' },
                { status: 400 }
            );
        }

        if (isotipo_url && !isotipo_url.startsWith('http')) {
            return NextResponse.json(
                { error: 'URL del isotipo inválida' },
                { status: 400 }
            );
        }

        // Preparar datos para actualización
        const updateData: any = {
            name: name.trim(),
            ...(slogan && { slogan: slogan.trim() }),
            ...(descripcion && { descripcion: descripcion.trim() }),
            ...(logoUrl && { logoUrl }),
            ...(isotipo_url && { isotipo_url })
        };

        // Procesar palabras clave
        if (palabras_clave && Array.isArray(palabras_clave)) {
            updateData.palabras_clave = JSON.stringify(palabras_clave);
        }

        // Actualizar el studio
        const studioActualizado = await prisma.projects.update({
            where: { id: studio!.id },
            data: updateData,
            select: {
                name: true,
                slogan: true,
                descripcion: true,
                palabras_clave: true,
                logoUrl: true,
                isotipo_url: true
            }
        });

        // Parsear palabras clave para la respuesta
        let palabrasClave = [];
        if (studioActualizado.palabras_clave) {
            try {
                palabrasClave = JSON.parse(studioActualizado.palabras_clave);
            } catch {
                palabrasClave = [];
            }
        }

        return NextResponse.json({
            ...studioActualizado,
            palabras_clave: palabrasClave
        });
    } catch (error) {
        console.error('Error updating identidad:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
