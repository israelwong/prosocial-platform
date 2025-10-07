'use server';

import { revalidatePath } from 'next/cache';

interface CreatePlataformaResult {
    success: boolean;
    error?: string;
    data?: any;
}

interface UpdatePlataformaResult {
    success: boolean;
    error?: string;
    data?: any;
}

interface DeletePlataformaResult {
    success: boolean;
    error?: string;
}

// Crear nueva plataforma de red social
export async function createPlataformaRedSocial(formData: FormData): Promise<CreatePlataformaResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/plataformas-redes`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Error al crear la plataforma'
            };
        }

        // Revalidar la página para mostrar los cambios
        revalidatePath('/admin/redes-sociales');

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Error creating plataforma:', error);
        return {
            success: false,
            error: 'Error de conexión. Intenta nuevamente.'
        };
    }
}

// Actualizar plataforma de red social
export async function updatePlataformaRedSocial(id: string, formData: FormData): Promise<UpdatePlataformaResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/plataformas-redes/${id}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Error al actualizar la plataforma'
            };
        }

        // Revalidar la página para mostrar los cambios
        revalidatePath('/admin/redes-sociales');

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Error updating plataforma:', error);
        return {
            success: false,
            error: 'Error de conexión. Intenta nuevamente.'
        };
    }
}

// Eliminar plataforma de red social
export async function deletePlataformaRedSocial(id: string): Promise<DeletePlataformaResult> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/plataformas-redes/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Error al eliminar la plataforma'
            };
        }

        // Revalidar la página para mostrar los cambios
        revalidatePath('/admin/redes-sociales');

        return {
            success: true
        };
    } catch (error) {
        console.error('Error deleting plataforma:', error);
        return {
            success: false,
            error: 'Error de conexión. Intenta nuevamente.'
        };
    }
}
