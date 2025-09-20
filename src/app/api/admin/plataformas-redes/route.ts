import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plataformas = await prisma.platform_plataformas_redes_sociales.findMany({
      orderBy: { orden: 'asc' }
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.nombre || !body.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug sea único
    const existingSlug = await prisma.platform_plataformas_redes_sociales.findUnique({
      where: { slug: body.slug }
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: 'El slug ya existe' },
        { status: 400 }
      );
    }

    // Verificar que el nombre sea único
    const existingNombre = await prisma.platform_plataformas_redes_sociales.findUnique({
      where: { nombre: body.nombre }
    });

    if (existingNombre) {
      return NextResponse.json(
        { error: 'El nombre ya existe' },
        { status: 400 }
      );
    }

    // Obtener el siguiente orden
    const lastPlataforma = await prisma.platform_plataformas_redes_sociales.findFirst({
      orderBy: { orden: 'desc' }
    });

    const nuevaPlataforma = await prisma.platform_plataformas_redes_sociales.create({
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion || null,
        color: body.color || null,
        icono: body.icono || null,
        urlBase: body.urlBase || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        orden: lastPlataforma ? lastPlataforma.orden + 1 : 0,
      }
    });

    return NextResponse.json(nuevaPlataforma, { status: 201 });
  } catch (error) {
    console.error('Error creating plataforma:', error);
    return NextResponse.json(
      { error: 'Error al crear la plataforma' },
      { status: 500 }
    );
  }
}
