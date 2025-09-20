import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plataforma = await prisma.platform_plataformas_redes_sociales.findUnique({
      where: { id: params.id }
    });

    if (!plataforma) {
      return NextResponse.json(
        { error: 'Plataforma no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(plataforma);
  } catch (error) {
    console.error('Error fetching plataforma:', error);
    return NextResponse.json(
      { error: 'Error al cargar la plataforma' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Verificar que la plataforma existe
    const existingPlataforma = await prisma.platform_plataformas_redes_sociales.findUnique({
      where: { id: params.id }
    });

    if (!existingPlataforma) {
      return NextResponse.json(
        { error: 'Plataforma no encontrada' },
        { status: 404 }
      );
    }

    // Si se está cambiando el slug, verificar que sea único
    if (body.slug && body.slug !== existingPlataforma.slug) {
      const existingSlug = await prisma.platform_plataformas_redes_sociales.findUnique({
        where: { slug: body.slug }
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: 'El slug ya existe' },
          { status: 400 }
        );
      }
    }

    // Si se está cambiando el nombre, verificar que sea único
    if (body.nombre && body.nombre !== existingPlataforma.nombre) {
      const existingNombre = await prisma.platform_plataformas_redes_sociales.findUnique({
        where: { nombre: body.nombre }
      });

      if (existingNombre) {
        return NextResponse.json(
          { error: 'El nombre ya existe' },
          { status: 400 }
        );
      }
    }

    const plataformaActualizada = await prisma.platform_plataformas_redes_sociales.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
        color: body.color,
        icono: body.icono,
        urlBase: body.urlBase,
        isActive: body.isActive,
        orden: body.orden,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(plataformaActualizada);
  } catch (error) {
    console.error('Error updating plataforma:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la plataforma' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que la plataforma existe
    const existingPlataforma = await prisma.platform_plataformas_redes_sociales.findUnique({
      where: { id: params.id },
      include: {
        project_redes_sociales: true
      }
    });

    if (!existingPlataforma) {
      return NextResponse.json(
        { error: 'Plataforma no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si hay redes sociales usando esta plataforma
    if (existingPlataforma.project_redes_sociales.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la plataforma porque está siendo usada por estudios' },
        { status: 400 }
      );
    }

    await prisma.platform_plataformas_redes_sociales.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Plataforma eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting plataforma:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la plataforma' },
      { status: 500 }
    );
  }
}
