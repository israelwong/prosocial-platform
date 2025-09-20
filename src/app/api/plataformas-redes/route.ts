import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plataformas = await prisma.platform_plataformas_redes_sociales.findMany({
      where: { isActive: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        color: true,
        icono: true,
        urlBase: true,
        orden: true,
      }
    });

    return NextResponse.json(plataformas);
  } catch (error) {
    console.error('Error fetching plataformas activas:', error);
    return NextResponse.json(
      { error: 'Error al cargar las plataformas' },
      { status: 500 }
    );
  }
}
