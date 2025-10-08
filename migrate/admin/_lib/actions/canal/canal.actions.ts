// Ruta: app/admin/_lib/actions/canal/canal.actions.ts

'use server'

import { prisma } from '@/lib/prisma'

// =============================================================================
// FUNCIONES MIGRADAS DESDE ARCHIVOS LEGACY
// =============================================================================

/**
 * Obtener canales - MIGRADA desde @/app/admin/_lib/canal.actions
 * Función simple para obtener todos los canales
 * Utilizada por: FormEventoNuevoFinal
 */
export async function obtenerCanalesLegacy() {
    return await prisma.canal.findMany();
}
