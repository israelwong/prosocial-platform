'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ContactoData, Telefono, Horario, ZonaTrabajo } from '@/app/[slug]/studio/builder/contacto/types';

export async function obtenerContactoStudio(studioSlug: string) {
    try {
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!studio) {
            return { success: false, error: 'Studio no encontrado' };
        }

        // Por ahora retornamos datos de ejemplo hasta que tengamos la tabla
        const contactoData: ContactoData = {
            id: 'temp-id',
            studio_id: studio.id,
            descripcion: 'Estudio de fotografía especializado en eventos y retratos',
            direccion: 'Calle Principal 123, Ciudad',
            google_maps_url: '',
            horarios: [
                {
                    id: '1',
                    dia: 'Lunes',
                    apertura: '09:00',
                    cierre: '18:00',
                    cerrado: false
                },
                {
                    id: '2',
                    dia: 'Martes',
                    apertura: '09:00',
                    cierre: '18:00',
                    cerrado: false
                }
            ],
            telefonos: [
                {
                    id: '1',
                    numero: '+1 234 567 8900',
                    tipo: 'ambos',
                    etiqueta: 'Principal'
                }
            ],
            zonas_trabajo: [
                {
                    id: '1',
                    nombre: 'Centro',
                    color: '#3B82F6'
                },
                {
                    id: '2',
                    nombre: 'Norte',
                    color: '#10B981'
                }
            ]
        };

        return contactoData;
    } catch (error) {
        console.error('Error obteniendo contacto:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

export async function actualizarContacto(studioSlug: string, data: Partial<ContactoData>) {
    try {
        console.log('🔄 [actualizarContacto] Updating contacto for slug:', studioSlug, 'with data:', data);

        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!studio) {
            console.error('❌ [actualizarContacto] Studio not found:', studioSlug);
            return { success: false, error: 'Studio no encontrado' };
        }

        // Actualizar datos del studio
        const updateData: { description?: string; address?: string } = {};

        if (data.descripcion !== undefined) {
            updateData.description = data.descripcion;
        }

        if (data.direccion !== undefined) {
            updateData.address = data.direccion;
        }

        // Solo actualizar si hay datos que cambiar
        if (Object.keys(updateData).length > 0) {
            await prisma.studios.update({
                where: { id: studio.id },
                data: updateData
            });
            console.log('✅ [actualizarContacto] Studio updated successfully');
        }

        // Revalidar la página para reflejar los cambios
        revalidatePath(`/studio/${studioSlug}/builder/contacto`);
        console.log('✅ [actualizarContacto] Page revalidated');

        return { success: true };
    } catch (error) {
        console.error('❌ [actualizarContacto] Error:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}