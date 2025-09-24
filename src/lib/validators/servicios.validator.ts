// src/lib/validators/servicios.validator.ts

import { BaseValidator } from './base-validator';
import { ValidationResult } from '@/types/setup-validation';

export class ServiciosValidator extends BaseValidator {
    async validate(projectData: any): Promise<ValidationResult> {
        const requiredFields: string[] = [];
        const optionalFields = ['servicios'];

        const completedFields: string[] = [];
        const missingFields: string[] = [];
        const errors: string[] = [];

        let completionPercentage = 0;

        // Validar servicios
        if (projectData.servicios && Array.isArray(projectData.servicios)) {
            const activeServicios = projectData.servicios.filter((servicio: any) =>
                servicio.status === 'active'
            );

            if (activeServicios.length > 0) {
                completedFields.push('servicios');

                let validServicios = 0;

                for (const servicio of activeServicios) {
                    let isValidServicio = true;

                    // Validar campos básicos
                    if (!servicio.nombre || servicio.nombre.trim().length === 0) {
                        errors.push('Servicio sin nombre configurado');
                        isValidServicio = false;
                    }

                    // Validar precio
                    if (!servicio.precio || servicio.precio <= 0) {
                        errors.push(`Precio inválido para el servicio: ${servicio.nombre || 'Sin nombre'}`);
                        isValidServicio = false;
                    }

                    if (isValidServicio) {
                        validServicios++;
                    }
                }

                // Calcular porcentaje basado en servicios válidos
                if (validServicios > 0) {
                    completionPercentage = Math.min(100, 50 + (validServicios * 10)); // Base 50% + 10% por servicio válido
                } else {
                    completionPercentage = 25; // Configurado pero sin servicios válidos
                }
            } else {
                missingFields.push('servicios_activos');
                completionPercentage = 10; // Configurado pero sin servicios activos
            }
        } else {
            missingFields.push('servicios');
            completionPercentage = 0;
        }

        return {
            isValid: errors.length === 0 && completionPercentage >= 50,
            completionPercentage,
            completedFields,
            missingFields,
            errors
        };
    }
}
