/**
 * ARCHIVO DE COMPATIBILIDAD - PRICING
 * 
 * Este archivo mantiene compatibilidad con imports antiguos.
 * Las funciones reales están en calcular-precio.ts
 */

export {
    calcularPrecio as calcularPrecios,
    formatearMoneda as formatCurrency,
    type ConfiguracionPrecios as PricingConfig,
    type ResultadoPrecio,
} from './calcular-precio';

/**
 * Alias para compatibilidad con código antiguo
 */
export function formatCurrency(amount: number): string {
    const { formatearMoneda } = require('./calcular-precio');
    return formatearMoneda(amount);
}
