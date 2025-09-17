/**
 * Helper para manejar reintentos en operaciones de base de datos
 * Especialmente útil para errores P1001 de Supabase
 */

export interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
}

/**
 * Ejecuta una función con reintentos automáticos para errores de conectividad
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 5000 } = options;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: unknown) {
            const prismaError = error as { code?: string; message?: string };
            
            // Solo reintentar si es error de conectividad P1001
            if (prismaError.code === 'P1001' && attempt < maxRetries) {
                const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
                console.warn(`⚠️ Error P1001 en intento ${attempt}, reintentando en ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            
            // Si no es P1001 o se agotaron los intentos, lanzar error
            throw error;
        }
    }
    
    throw new Error('Operación falló después de todos los reintentos');
}

/**
 * Verifica si un error es de conectividad P1001
 */
export function isConnectionError(error: unknown): boolean {
    const prismaError = error as { code?: string; message?: string };
    return prismaError.code === 'P1001' || 
           prismaError.message?.includes('Can\'t reach database server') ||
           prismaError.message?.includes('connection');
}

/**
 * Obtiene un mensaje de error amigable para el usuario
 */
export function getFriendlyErrorMessage(error: unknown): string {
    if (isConnectionError(error)) {
        return 'Error de conectividad con la base de datos. Verifica tu conexión a internet e intenta nuevamente.';
    }
    
    const prismaError = error as { code?: string; message?: string };
    
    switch (prismaError.code) {
        case 'P2002':
            return 'Ya existe un registro con estos datos. Verifica la información e intenta nuevamente.';
        case 'P2025':
            return 'El registro solicitado no existe o ha sido eliminado.';
        case 'P2003':
            return 'Error de referencia: el registro relacionado no existe.';
        case 'P2014':
            return 'Error de relación: no se puede crear la conexión entre registros.';
        default:
            return prismaError.message || 'Error desconocido de base de datos.';
    }
}
