"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { revalidatePath } from "next/cache";
import {
  RedSocialCreateSchema,
  RedSocialUpdateSchema,
  RedSocialBulkUpdateSchema,
  RedSocialToggleSchema,
  RedSocialFiltersSchema,
  type RedSocialCreateForm,
  type RedSocialUpdateForm,
  type RedSocialBulkUpdateForm,
  type RedSocialToggleForm,
  type RedSocialFiltersForm,
} from "@/lib/actions/schemas/redes-sociales-schemas";

// Obtener redes sociales del studio
export async function obtenerRedesSocialesStudio(
  studioSlug: string,
  filters?: RedSocialFiltersForm
) {
  return await retryDatabaseOperation(async () => {
    // 1. Obtener studio
    const studio = await prisma.projects.findUnique({
      where: { slug: studioSlug },
      select: { id: true, name: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    // 2. Construir filtros
    const whereClause: {
      projectId: string;
      activo?: boolean;
      plataformaId?: string;
    } = {
      projectId: studio.id,
    };

    if (filters) {
      const validatedFilters = RedSocialFiltersSchema.parse(filters);

      if (validatedFilters.activo !== undefined) {
        whereClause.activo = validatedFilters.activo;
      }

      if (validatedFilters.plataformaId) {
        whereClause.plataformaId = validatedFilters.plataformaId;
      }
    }

    // 3. Obtener redes sociales
    const redesSociales = await prisma.project_redes_sociales.findMany({
      where: whereClause,
      include: {
        plataforma: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return redesSociales;
  });
}

// Crear red social
export async function crearRedSocial(
  studioSlug: string,
  data: RedSocialCreateForm
) {
  return await retryDatabaseOperation(async () => {
    // 1. Obtener studio
    const studio = await prisma.projects.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    // 2. Validar datos
    const validatedData = RedSocialCreateSchema.parse(data);

    // 3. Verificar si ya existe una red social activa de la misma plataforma
    const existingRed = await prisma.project_redes_sociales.findFirst({
      where: {
        projectId: studio.id,
        plataformaId: validatedData.plataformaId,
        activo: true,
      },
    });

    if (existingRed) {
      throw new Error("Ya tienes una red social activa de esta plataforma");
    }

    // 4. Crear red social
    const nuevaRedSocial = await prisma.project_redes_sociales.create({
      data: {
        projectId: studio.id,
        plataformaId: validatedData.plataformaId,
        url: validatedData.url,
        activo: validatedData.activo,
      },
      include: {
        plataforma: true,
      },
    });

    // 5. Revalidar cache
    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/redes-sociales`);

    return nuevaRedSocial;
  });
}

// Actualizar red social
export async function actualizarRedSocial(
  redSocialId: string,
  data: RedSocialUpdateForm
) {
  return await retryDatabaseOperation(async () => {
    // 1. Validar datos
    const validatedData = RedSocialUpdateSchema.parse(data);

    // 2. Obtener red social existente
    const existingRedSocial = await prisma.project_redes_sociales.findUnique({
      where: { id: redSocialId },
      include: {
        projects: { select: { slug: true } },
        plataforma: true
      },
    });

    if (!existingRedSocial) {
      throw new Error("Red social no encontrada");
    }

    // 3. Actualizar red social
    const redSocialActualizada = await prisma.project_redes_sociales.update({
      where: { id: redSocialId },
      data: {
        ...(validatedData.url && { url: validatedData.url }),
        ...(validatedData.activo !== undefined && { activo: validatedData.activo }),
      },
      include: {
        plataforma: true,
      },
    });

    // 4. Revalidar cache
    revalidatePath(`/studio/${existingRedSocial.projects.slug}/configuracion/cuenta/redes-sociales`);

    return redSocialActualizada;
  });
}

// Actualizar múltiples redes sociales
export async function actualizarRedesSocialesBulk(
  studioSlug: string,
  data: RedSocialBulkUpdateForm
) {
  return await retryDatabaseOperation(async () => {
    // 1. Obtener studio
    const studio = await prisma.projects.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    // 2. Validar datos
    const validatedData = RedSocialBulkUpdateSchema.parse(data);

    // 3. Validar todas las URLs
    for (const red of validatedData.redesSociales) {
      if (red.url) {
        try {
          new URL(red.url);
        } catch {
          throw new Error(`URL inválida para red social ${red.id}`);
        }
      }
    }

    // 4. Actualizar todas las redes sociales en una transacción
    const resultados = await prisma.$transaction(
      validatedData.redesSociales.map((red) =>
        prisma.project_redes_sociales.update({
          where: { id: red.id },
          data: {
            ...(red.url && { url: red.url }),
            ...(red.activo !== undefined && { activo: red.activo }),
          },
          include: {
            plataforma: true,
          },
        })
      )
    );

    // 5. Revalidar cache
    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/redes-sociales`);

    return resultados;
  });
}

// Eliminar red social
export async function eliminarRedSocial(redSocialId: string) {
  return await retryDatabaseOperation(async () => {
    // 1. Obtener red social existente
    const existingRedSocial = await prisma.project_redes_sociales.findUnique({
      where: { id: redSocialId },
      include: {
        projects: { select: { slug: true } },
        plataforma: true
      },
    });

    if (!existingRedSocial) {
      throw new Error("Red social no encontrada");
    }

    // 2. Eliminar red social
    await prisma.project_redes_sociales.delete({
      where: { id: redSocialId },
    });

    // 3. Revalidar cache
    revalidatePath(`/studio/${existingRedSocial.projects.slug}/configuracion/cuenta/redes-sociales`);

    return { success: true };
  });
}

// Toggle estado de red social
export async function toggleRedSocialEstado(
  redSocialId: string,
  data: RedSocialToggleForm
) {
  return await retryDatabaseOperation(async () => {
    // 1. Validar datos
    const validatedData = RedSocialToggleSchema.parse(data);

    // 2. Obtener red social existente
    const existingRedSocial = await prisma.project_redes_sociales.findUnique({
      where: { id: redSocialId },
      include: {
        projects: { select: { slug: true } },
        plataforma: true
      },
    });

    if (!existingRedSocial) {
      throw new Error("Red social no encontrada");
    }

    // 3. Actualizar estado
    const redSocialActualizada = await prisma.project_redes_sociales.update({
      where: { id: redSocialId },
      data: { activo: validatedData.activo },
      include: {
        plataforma: true,
      },
    });

    // 4. Revalidar cache
    revalidatePath(`/studio/${existingRedSocial.projects.slug}/configuracion/cuenta/redes-sociales`);

    return redSocialActualizada;
  });
}

// Obtener estadísticas de redes sociales
export async function obtenerEstadisticasRedesSociales(studioSlug: string) {
  return await retryDatabaseOperation(async () => {
    // 1. Obtener studio
    const studio = await prisma.projects.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    // 2. Obtener estadísticas
    const [total, activas, inactivas] = await Promise.all([
      prisma.project_redes_sociales.count({
        where: { projectId: studio.id },
      }),
      prisma.project_redes_sociales.count({
        where: { projectId: studio.id, activo: true },
      }),
      prisma.project_redes_sociales.count({
        where: { projectId: studio.id, activo: false },
      }),
    ]);

    return {
      total,
      activas,
      inactivas,
      porcentajeActivas: total > 0 ? Math.round((activas / total) * 100) : 0,
    };
  });
}