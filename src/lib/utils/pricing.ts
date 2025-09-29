/**
 * Pricing Utilities - Cálculo dinámico de precios
 * 
 * Estos helpers calculan precios al vuelo usando la configuración del estudio.
 * Los valores NO se almacenan en project_servicios, solo se calculan cuando se necesitan.
 * 
 * Para cotizaciones, los precios SÍ se congelan al momento de crear la cotización.
 */

export interface PricingConfig {
    utilidad_servicio: number;
    utilidad_producto: number;
    sobreprecio: number;
    comision_venta: number;
}

export interface PricingResult {
    utilidad: number;
    precio_publico: number;
}

/**
 * Calcula utilidad y precio público de un servicio
 * 
 * @param costo - Costo base del servicio
 * @param gasto - Suma de gastos fijos
 * @param tipoUtilidad - Tipo de utilidad a aplicar ("servicio" o "producto")
 * @param config - Configuración de precios del estudio
 * @returns Objeto con utilidad y precio_publico calculados
 * 
 * @example
 * const precios = calcularPrecios(1000, 100, 'servicio', {
 *   utilidad_servicio: 30,
 *   utilidad_producto: 0,
 *   sobreprecio: 10,
 *   comision_venta: 5
 * });
 * // => { utilidad: 471.43, precio_publico: 1814.99 }
 */
export function calcularPrecios(
    costo: number,
    gasto: number,
    tipoUtilidad: 'servicio' | 'producto',
    config: PricingConfig
): PricingResult {
    // 1. Determinar porcentaje de utilidad según tipo
    const utilidadPorcentaje =
        tipoUtilidad === 'servicio'
            ? config.utilidad_servicio
            : config.utilidad_producto;

    // 2. Calcular costo total
    const costoTotal = costo + gasto;

    // 3. Calcular subtotal con utilidad
    const subtotal = costoTotal / (1 - utilidadPorcentaje / 100);

    // 4. Calcular utilidad en pesos
    const utilidad = subtotal - costoTotal;

    // 5. Aplicar sobreprecio
    const conSobreprecio = subtotal * (1 + config.sobreprecio / 100);

    // 6. Aplicar comisión de venta
    const precioPublico = conSobreprecio * (1 + config.comision_venta / 100);

    return {
        utilidad: Number(utilidad.toFixed(2)),
        precio_publico: Number(precioPublico.toFixed(2)),
    };
}

/**
 * Formatea un número como moneda mexicana
 * @param amount - Monto a formatear
 * @param includeDecimals - Si debe incluir decimales (default: true)
 */
export function formatCurrency(amount: number, includeDecimals = true): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: includeDecimals ? 2 : 0,
        maximumFractionDigits: includeDecimals ? 2 : 0,
    }).format(amount);
}
