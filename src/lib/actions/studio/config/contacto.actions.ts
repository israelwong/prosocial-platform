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
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!studio) {
            return { success: false, error: 'Studio no encontrado' };
        }

        // TODO: Implementar actualización en base de datos
        // Por ahora solo revalidamos la página
        revalidatePath(`/studio/${studioSlug}/builder/contacto`);

        return { success: true };
    } catch (error) {
        console.error('Error actualizando contacto:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}