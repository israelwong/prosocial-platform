// src/lib/validators/condiciones.validator.ts

import { BaseValidator } from './base-validator';
import { ValidationResult } from '@/types/setup-validation';

export class CondicionesValidator extends BaseValidator {
    async validate(projectData: any): Promise<ValidationResult> {
        const requiredFields: string[] = [];
        const optionalFields = ['condiciones_comerciales'];

        const completedFields: string[] = [];
        const missingFields: string[] = [];
        const errors: string[] = [];

        let completionPercentage = 0;

        // Validar condiciones comerciales
        if (projectData.condiciones_comerciales && Array.isArray(projectData.condiciones_comerciales)) {
            const activeCondiciones = projectData.condiciones_comerciales.filter((condicion: any) =>
                condicion.status === 'active'
            );

            if (activeCondiciones.length > 0) {
                completedFields.push('condiciones_comerciales');
                completionPercentage = 100;

                // Validar que al menos una condición tenga configuración válida
                let validCondiciones = 0;

                for (const condicion of activeCondiciones) {
                    if (condicion.nombre && condicion.nombre.trim().length > 0) {
                        validCondiciones++;
                    }

                    // Validar porcentajes si existen
                    if (condicion.porcentaje_descuento &&
                        (condicion.porcentaje_descuento < 0 || condicion.porcentaje_descuento > 100)) {
                        errors.push(`Porcentaje de descuento inválido en: ${condicion.nombre}`);
                    }

                    if (condicion.porcentaje_anticipo &&
                        (condicion.porcentaje_anticipo < 0 || condicion.porcentaje_anticipo > 100)) {
                        errors.push(`Porcentaje de anticipo inválido en: ${condicion.nombre}`);
                    }
                }

                if (validCondiciones === 0) {
                    errors.push('No hay condiciones comerciales válidas configuradas');
                    completionPercentage = 50;
                }
            } else {
                missingFields.push('condiciones_comerciales_activas');
                completionPercentage = 25; // Configurado pero sin condiciones activas
            }
        } else {
            missingFields.push('condiciones_comerciales');
            completionPercentage = 0;
        }

        return {
            isValid: errors.length === 0 && completionPercentage >= 80,
            completionPercentage,
            completedFields,
            missingFields,
            errors
        };
    }
}
