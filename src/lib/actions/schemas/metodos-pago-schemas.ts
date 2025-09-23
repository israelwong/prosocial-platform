// Ruta: src/lib/actions/schemas/metodos-pago-schemas.ts

import { z } from 'zod';

export const MetodoPagoSchema = z.object({
    id: z.string().optional(),
    metodo_pago: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),

    // Tratamos los números como strings para el formulario
    comision_porcentaje_base: z.string().nullable().optional(),
    comision_fija_monto: z.string().nullable().optional(),

    payment_method: z.string().nullable().optional(),
    tipo: z.enum(['manual', 'stripe_automatico', 'msi']).default('manual'),
    requiere_stripe: z.boolean().default(false),

    status: z.enum(['active', 'inactive']),
    orden: z.number().optional().default(0),
});

export type MetodoPagoForm = z.infer<typeof MetodoPagoSchema>;

// Schema para actualización masiva
export const MetodosPagoBulkSchema = z.object({
    metodos: z.array(MetodoPagoSchema),
});

export type MetodosPagoBulkForm = z.infer<typeof MetodosPagoBulkSchema>;
