import { z } from "zod";
import { NameSchema, EmailSchema, PhoneSchema, IdSchema } from "./shared-schemas";

// Enum para tipo de personal
export const PersonnelTypeSchema = z.enum(["EMPLEADO", "PROVEEDOR"]);

// Schema para perfiles profesionales dinámicos
export const PersonnelProfileSchema = z.object({
    id: IdSchema,
    name: z.string(),
    slug: z.string(),
    color: z.string().optional(),
    icon: z.string().optional(),
});

// Schema base para personal
export const PersonalBaseSchema = z.object({
    fullName: NameSchema,
    email: EmailSchema,
    phone: PhoneSchema.optional(),
    type: PersonnelTypeSchema,
    isActive: z.boolean().default(true),
});

// Schema para crear personal
export const PersonalCreateSchema = PersonalBaseSchema.extend({
    profileIds: z.array(IdSchema).min(1, "Debe seleccionar al menos un perfil profesional"),
    profileDescriptions: z.record(z.string()).optional(), // Descripciones por perfil
});

// Schema para actualizar personal
export const PersonalUpdateSchema = PersonalBaseSchema.partial().extend({
    id: IdSchema,
    profileIds: z.array(IdSchema).optional(),
    profileDescriptions: z.record(z.string()).optional(),
});

// Schema para filtros de personal
export const PersonalFiltersSchema = z.object({
    type: PersonnelTypeSchema.optional(),
    profileId: IdSchema.optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
});

// Schema para perfil profesional individual
export const ProfessionalProfileSchema = z.object({
    id: IdSchema.optional(),
    userId: IdSchema,
    profile: PersonnelProfileSchema,
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

// Tipos TypeScript derivados
export type PersonnelType = z.infer<typeof PersonnelTypeSchema>;
export type PersonnelProfile = z.infer<typeof PersonnelProfileSchema>;
export type PersonalCreateForm = z.infer<typeof PersonalCreateSchema>;
export type PersonalUpdateForm = z.infer<typeof PersonalUpdateSchema>;
export type PersonalFiltersForm = z.infer<typeof PersonalFiltersSchema>;
export type ProfessionalProfileForm = z.infer<typeof ProfessionalProfileSchema>;

// Constantes para UI
export const PERSONNEL_TYPE_LABELS: Record<PersonnelType, string> = {
    EMPLEADO: "Empleado",
    PROVEEDOR: "Proveedor",
};

export const PERSONNEL_PROFILE_LABELS: Record<PersonnelProfile, string> = {
    FOTOGRAFO: "Fotógrafo",
    CAMAROGRAFO: "Camarógrafo",
    EDITOR: "Editor",
    RETOCADOR: "Retocador",
    OPERADOR_DRON: "Operador de Dron",
    ASISTENTE: "Asistente",
    COORDINADOR: "Coordinador",
};

export const PERSONNEL_PROFILE_DESCRIPTIONS: Record<PersonnelProfile, string> = {
    FOTOGRAFO: "Especialista en captura de imágenes fotográficas",
    CAMAROGRAFO: "Especialista en grabación de video",
    EDITOR: "Especialista en edición y postproducción",
    RETOCADOR: "Especialista en retoque fotográfico",
    OPERADOR_DRON: "Piloto certificado de drones para tomas aéreas",
    ASISTENTE: "Apoyo general en producciones",
    COORDINADOR: "Coordinación de equipos y producciones",
};
