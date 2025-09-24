import { z } from "zod";

export const CuentaBancariaCreateSchema = z.object({
    banco: z.string().min(1, "El banco es requerido").max(100, "El nombre del banco es muy largo"),
    numeroCuenta: z.string().min(1, "El número de cuenta es requerido").max(50, "El número de cuenta es muy largo"),
    tipoCuenta: z.enum(['corriente', 'ahorro'], {
        required_error: "El tipo de cuenta es requerido",
        invalid_type_error: "El tipo de cuenta debe ser 'corriente' o 'ahorro'"
    }),
    titular: z.string().min(1, "El titular es requerido").max(100, "El nombre del titular es muy largo"),
    activo: z.boolean().default(true),
    esPrincipal: z.boolean().default(false),
});

export type CuentaBancariaCreateForm = z.infer<typeof CuentaBancariaCreateSchema>;

export const CuentaBancariaUpdateSchema = z.object({
    id: z.string().min(1, "ID requerido"),
    banco: z.string().min(1, "El banco es requerido").max(100, "El nombre del banco es muy largo").optional(),
    numeroCuenta: z.string().min(1, "El número de cuenta es requerido").max(50, "El número de cuenta es muy largo").optional(),
    tipoCuenta: z.enum(['corriente', 'ahorro']).optional(),
    titular: z.string().min(1, "El titular es requerido").max(100, "El nombre del titular es muy largo").optional(),
    activo: z.boolean().optional(),
    esPrincipal: z.boolean().optional(),
});

export type CuentaBancariaUpdateForm = z.infer<typeof CuentaBancariaUpdateSchema>;

export const CuentaBancariaDeleteSchema = z.object({
    id: z.string().min(1, "ID requerido"),
});

export type CuentaBancariaDeleteForm = z.infer<typeof CuentaBancariaDeleteSchema>;
