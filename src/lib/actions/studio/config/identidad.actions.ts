"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { revalidatePath } from "next/cache";
import {
  IdentidadUpdateSchema,
  LogoUpdateSchema,
  type IdentidadUpdateForm,
  type LogoUpdateForm,
} from "@/lib/actions/schemas/identidad-schemas";

// Obtener datos de identidad del studio
export async function obtenerIdentidadStudio(studioSlug: string) {
  return await retryDatabaseOperation(async () => {
    const studio = await prisma.studios.findUnique({
      where: { slug: studioSlug },
      select: {
        id: true,
        studio_name: true,
        slug: true,
        slogan: true,
        description: true,
        keywords: true,
        logo_url: true,
        isotipo_url: true,
      },
    });

    if (!studio) {
      console.error(`❌ Studio no encontrado con slug: ${studioSlug}`);
      return {
        success: false,
        error: `Studio con slug "${studioSlug}" no encontrado. Verifica que el studio existe y está activo.`,
      };
    }

    // Parsear palabras clave si existen
    let palabrasClave: string[] = [];
    if (studio.keywords) {
      try {
        palabrasClave = JSON.parse(studio.keywords);
      } catch {
        // Si no se puede parsear, usar como string simple
        palabrasClave = studio.keywords.split(',').map(p => p.trim()).filter(p => p);
      }
    }

    return {
      ...studio,
      palabras_clave: palabrasClave,
    };
  });
}

// Actualizar información básica de identidad
export async function actualizarIdentidadBasica(
  studioSlug: string,
  data: IdentidadUpdateForm
) {
  return await retryDatabaseOperation(async () => {
    const studio = await prisma.studios.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    const validatedData = IdentidadUpdateSchema.parse(data);

    const studioActualizado = await prisma.studios.update({
      where: { id: studio.id },
      data: {
        studio_name: validatedData.nombre,
        slogan: validatedData.slogan,
        description: validatedData.descripcion,
        logo_url: validatedData.logo_url,      // Corregido: logoUrl → logo_url
        isotipo_url: validatedData.isotipo_url, // ✅ Ya correcto
      },
      select: {
        studio_name: true,
        slogan: true,
        description: true,
        logo_url: true,      // ✅ Cambiar a logo_url
        isotipo_url: true,
      },
    });

    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/identidad`);
    return studioActualizado;
  });
}

// Actualizar palabras clave
export async function actualizarPalabrasClave(
  studioSlug: string,
  palabrasClave: string[]
) {
  return await retryDatabaseOperation(async () => {
    const studio = await prisma.studios.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    // Convertir array a string JSON
    const palabrasClaveString = JSON.stringify(palabrasClave);

    await prisma.studios.update({
      where: { id: studio.id },
      data: {
        keywords: palabrasClaveString,
      },
      select: {
        keywords: true,
      },
    });

    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/identidad`);
    return {
      keywords: palabrasClave,
    };
  });
}

// Actualizar logo o isotipo
export async function actualizarLogo(
  studioSlug: string,
  data: LogoUpdateForm
) {
  return await retryDatabaseOperation(async () => {
    const studio = await prisma.studios.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    const validatedData = LogoUpdateSchema.parse(data);

    const updateData = validatedData.tipo === "logo"
      ? { logo_url: validatedData.url }      // ✅ Cambiar a logo_url
      : { isotipo_url: validatedData.url };

    const studioActualizado = await prisma.studios.update({
      where: { id: studio.id },
      data: updateData,
      select: {
        logo_url: true,      // ✅ Cambiar a logo_url
        isotipo_url: true,
      },
    });

    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/identidad`);
    return studioActualizado;
  });
}

// Actualizar múltiples campos de identidad
export async function actualizarIdentidadCompleta(
  studioSlug: string,
  data: IdentidadUpdateForm & { palabras_clave?: string[] }
) {
  return await retryDatabaseOperation(async () => {
    const studio = await prisma.studios.findUnique({
      where: { slug: studioSlug },
      select: { id: true },
    });

    if (!studio) {
      throw new Error("Studio no encontrado");
    }

    const validatedData = IdentidadUpdateSchema.parse(data);

    // Preparar datos de actualización con tipo explícito
    const updateData: {
      studio_name: string;
      slogan: string | null;
      descripcion: string | null;
      logo_url: string | null;
      isotipo_url: string | null;
      palabras_clave?: string;
    } = {
      studio_name: validatedData.nombre,
      slogan: validatedData.slogan ?? null,
      descripcion: validatedData.descripcion ?? null,
      logo_url: validatedData.logo_url ?? null, // Corregido: logoUrl → logo_url
      isotipo_url: validatedData.isotipo_url ?? null,
    };

    // Agregar palabras clave si se proporcionan
    if (data.palabras_clave) {
      updateData.palabras_clave = JSON.stringify(data.palabras_clave);
    }

    const studioActualizado = await prisma.studios.update({
      where: { id: studio.id },
      data: updateData,
      select: {
        studio_name: true,
        slogan: true,
        description: true,
        keywords: true,
        logo_url: true,
        isotipo_url: true,
      },
    });

    // Parsear palabras clave para la respuesta
    let palabrasClave: string[] = [];
    if (studioActualizado.keywords) {
      try {
        palabrasClave = JSON.parse(studioActualizado.keywords);
      } catch {
        palabrasClave = studioActualizado.keywords.split(',').map(p => p.trim()).filter(p => p);
      }
    }

    revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/identidad`);
    return {
      ...studioActualizado,
      palabras_clave: palabrasClave,
    };
  });
}