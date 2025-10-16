"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ZonaTrabajoData {
  id: string;
  studio_id: string;
  nombre: string;
  orden: number;
  created_at: Date;
  updated_at: Date;
}

export interface ZonaTrabajoFormData {
  nombre: string;
}

/**
 * Obtener todas las zonas de trabajo de un studio
 */
/**
 * Crear una nueva zona de trabajo
 */
export async function crearZonaTrabajo(
  studioId: string,
  data: ZonaTrabajoFormData
) {
  try {
    // Obtener el siguiente orden
    const ultimaZona = await prisma.studio_zonas_trabajo.findFirst({
      where: { studio_id: studioId },
      orderBy: { orden: 'desc' }
    });

    const nuevoOrden = ultimaZona ? ultimaZona.orden + 1 : 0;

    const zona = await prisma.studio_zonas_trabajo.create({
      data: {
        studio_id: studioId,
        nombre: data.nombre,
        orden: nuevoOrden
      }
    });

    revalidatePath(`/studio/[slug]/builder/contacto`, 'page');
    return { success: true, zona };
  } catch (error) {
    console.error("Error creando zona de trabajo:", error);
    return { success: false, error: "Error al crear la zona de trabajo" };
  }
}

/**
 * Actualizar una zona de trabajo
 */
export async function actualizarZonaTrabajo(
  zonaId: string,
  data: ZonaTrabajoFormData
) {
  try {
    const zona = await prisma.studio_zonas_trabajo.update({
      where: { id: zonaId },
      data: {
        nombre: data.nombre
      }
    });

    revalidatePath(`/studio/[slug]/builder/contacto`, 'page');
    return { success: true, zona };
  } catch (error) {
    console.error("Error actualizando zona de trabajo:", error);
    return { success: false, error: "Error al actualizar la zona de trabajo" };
  }
}

/**
 * Eliminar una zona de trabajo
 */
export async function eliminarZonaTrabajo(zonaId: string) {
  try {
    await prisma.studio_zonas_trabajo.delete({
      where: { id: zonaId }
    });

    revalidatePath(`/studio/[slug]/builder/contacto`, 'page');
    return { success: true };
  } catch (error) {
    console.error("Error eliminando zona de trabajo:", error);
    return { success: false, error: "Error al eliminar la zona de trabajo" };
  }
}

/**
 * Reordenar zonas de trabajo
 */
export async function reordenarZonasTrabajo(
  studioId: string,
  zonasOrdenadas: { id: string; orden: number }[]
) {
  try {
    // Actualizar todas las zonas en una transacción
    await prisma.$transaction(
      zonasOrdenadas.map((zona) =>
        prisma.studio_zonas_trabajo.update({
          where: { id: zona.id },
          data: { orden: zona.orden }
        })
      )
    );

    revalidatePath(`/studio/[slug]/builder/contacto`, 'page');
    return { success: true };
  } catch (error) {
    console.error("Error reordenando zonas de trabajo:", error);
    return { success: false, error: "Error al reordenar las zonas de trabajo" };
  }
}
