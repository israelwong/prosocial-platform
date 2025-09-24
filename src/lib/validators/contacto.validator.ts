// src/lib/validators/contacto.validator.ts

import { BaseValidator } from './base-validator';
import { ValidationResult } from '@/types/setup-validation';

export class ContactoValidator extends BaseValidator {
    async validate(projectData: any): Promise<ValidationResult> {
        const requiredFields = ['email'];
        const optionalFields = ['phone', 'address', 'website'];
        const allFields = [...requiredFields, ...optionalFields];

        // Validar campos requeridos
        const requiredValidation = this.validateRequiredFields(projectData, requiredFields);

        // Validar campos opcionales
        const optionalValidation = this.validateOptionalFields(projectData, optionalFields);

        // Combinar resultados
        const completedFields = [...requiredValidation.completed, ...optionalValidation.completed];
        const missingFields = requiredValidation.missing;

        // Calcular porcentaje: campos requeridos (70%) + opcionales (30%)
        const requiredPercentage = this.calculateCompletionPercentage(
            requiredValidation.completed,
            requiredFields
        );

        const optionalPercentage = Math.round((optionalValidation.completed.length / optionalFields.length) * 30);
        const finalPercentage = Math.min(100, requiredPercentage + optionalPercentage);

        const errors: string[] = [];

        // Validaciones específicas
        if (projectData.email && !this.isValidEmail(projectData.email)) {
            errors.push('El formato del email no es válido');
        }

        if (projectData.phone && !this.isValidPhone(projectData.phone)) {
            errors.push('El formato del teléfono no es válido');
        }

        if (projectData.website && !this.isValidUrl(projectData.website)) {
            errors.push('El formato del sitio web no es válido');
        }

        // Si hay errores, el porcentaje se ajusta pero no se fuerza a 99%
        const hasErrors = errors.length > 0;
        const adjustedPercentage = hasErrors ? Math.min(95, finalPercentage) : finalPercentage;

        return {
            isValid: missingFields.length === 0 && errors.length === 0,
            completionPercentage: adjustedPercentage,
            completedFields,
            missingFields,
            errors
        };
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        // Validar teléfono mexicano (10 dígitos) o internacional
        const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
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
