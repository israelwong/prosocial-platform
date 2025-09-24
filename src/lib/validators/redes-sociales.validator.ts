// src/lib/validators/redes-sociales.validator.ts

import { BaseValidator } from './base-validator';
import { ValidationResult } from '@/types/setup-validation';

export class RedesSocialesValidator extends BaseValidator {
    async validate(projectData: any): Promise<ValidationResult> {
        const requiredFields: string[] = []; // No hay campos requeridos
        const optionalFields = ['redes_sociales'];

        // Validar campos opcionales
        const optionalValidation = this.validateOptionalFields(projectData, optionalFields);

        const completedFields = optionalValidation.completed;
        const missingFields: string[] = []; // No hay campos requeridos

        // Calcular porcentaje basado en redes sociales configuradas
        let completionPercentage = 0;

        if (projectData.redes_sociales && Array.isArray(projectData.redes_sociales)) {
            const activeRedesSociales = projectData.redes_sociales.filter((red: any) =>
                red.isActive && red.url && red.url.trim().length > 0
            );

            if (activeRedesSociales.length >= 2) {
                completionPercentage = 100; // Al menos 2 redes sociales
                completedFields.push('redes_sociales');
            } else if (activeRedesSociales.length === 1) {
                completionPercentage = 50; // Solo 1 red social
                completedFields.push('redes_sociales');
            } else {
                completionPercentage = 0; // Sin redes sociales configuradas
            }
        }

        const errors: string[] = [];

        // Validar URLs de redes sociales si existen
        if (projectData.redes_sociales && Array.isArray(projectData.redes_sociales)) {
            for (const red of projectData.redes_sociales) {
                if (red.url && !this.isValidUrl(red.url)) {
                    errors.push(`URL inválida para la red social: ${red.plataforma || 'Desconocida'}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            completionPercentage,
            completedFields,
            missingFields,
            errors
        };
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
