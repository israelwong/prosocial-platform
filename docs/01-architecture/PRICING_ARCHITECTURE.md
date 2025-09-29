# 💰 Arquitectura de Precios - ProSocial Platform

## 🎯 Decisión Arquitectónica

**Fecha:** 29 septiembre 2025  
**Estado:** ✅ Aprobado e Implementado

---

## 📋 Resumen

Los precios en ProSocial Platform utilizan un **modelo híbrido**:

- **Servicios del Catálogo** → Precios calculados al vuelo
- **Servicios en Cotizaciones** → Precios congelados al momento de cotizar

---

## 🏗️ Modelo de Datos

### **1. Catálogo de Servicios (`project_servicios`)**

```prisma
model project_servicios {
  costo         Float   // ✅ Almacenado
  gasto         Float   // ✅ Almacenado (suma de servicio_gastos)
  tipo_utilidad String  // ✅ Almacenado ("servicio" o "producto")
  
  // ❌ NO SE ALMACENAN:
  // utilidad       → Se calcula al vuelo
  // precio_publico → Se calcula al vuelo
}
```

**¿Por qué no almacenar?**
- ✅ Actualización automática cuando cambian porcentajes en `project_configuraciones`
- ✅ Un solo punto de verdad para lógica de pricing
- ✅ No requiere sincronización manual
- ✅ Reduce redundancia de datos

---

### **2. Servicios en Cotizaciones (`project_cotizacion_servicios`)**

```prisma
model project_cotizacion_servicios {
  costo          Float  // ✅ Congelado
  gasto          Float  // ✅ Congelado
  utilidad       Float  // ✅ Congelado
  precio_publico Float  // ✅ Congelado
  tipo_utilidad  String // ✅ Congelado
}
```

**¿Por qué sí almacenar?**
- ✅ Cotización no cambia aunque se actualicen porcentajes
- ✅ Auditoría: saber exactamente qué se cotizó
- ✅ Cliente ve precios consistentes
- ✅ Histórico preciso para reportes

---

## 🧮 Fórmula de Cálculo

### **Configuración Base (`project_configuraciones`)**

```typescript
utilidad_servicio: number  // % Ej: 30
utilidad_producto: number  // % Ej: 0
sobreprecio: number        // % Ej: 10
comision_venta: number     // % Ej: 5
```

### **Cálculo Dinámico**

```typescript
function calcularPrecioPublico(
  costo: number,
  gasto: number,
  tipoUtilidad: 'servicio' | 'producto',
  config: ProjectConfiguracion
): { utilidad: number; precio_publico: number } {
  
  // 1. Determinar porcentaje de utilidad según tipo
  const utilidadPorcentaje = tipoUtilidad === 'servicio' 
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
    precio_publico: Number(precioPublico.toFixed(2))
  };
}
```

### **Ejemplo Numérico**

```typescript
// Entrada
costo = 1000
gasto = 100
tipoUtilidad = 'servicio'
utilidad_servicio = 30%
sobreprecio = 10%
comision_venta = 5%

// Cálculo paso a paso
costoTotal = 1000 + 100 = 1100

subtotal = 1100 / (1 - 0.30) = 1571.43

utilidad = 1571.43 - 1100 = 471.43

conSobreprecio = 1571.43 * 1.10 = 1728.57

precioPublico = 1728.57 * 1.05 = 1814.99

// Resultado
utilidad: 471.43
precio_publico: 1814.99
```

---

## 🔄 Flujo de Actualización

### **Escenario 1: Usuario cambia configuración**

```
1. Usuario actualiza utilidad_servicio de 30% a 35%
2. Todos los servicios se recalculan automáticamente al mostrarse
3. NO se requiere acción manual
4. Cotizaciones existentes NO se afectan (mantienen precios congelados)
```

### **Escenario 2: Usuario crea cotización**

```
1. Sistema obtiene servicios del catálogo
2. Calcula precio_publico al vuelo con config actual
3. Al guardar cotización, congela todos los valores:
   - costo
   - gasto
   - utilidad (calculada)
   - precio_publico (calculado)
4. Cotización mantiene esos precios para siempre
```

---

## 📊 Ubicaciones de Cálculo

### **Frontend**
- `ServicioForm.tsx` - Cálculo en tiempo real al editar
- `ServicioCard.tsx` - Mostrar precio calculado
- `CatalogoList.tsx` - Listado con precios dinámicos

### **Backend**
- `catalogo.actions.ts` - Helper `calcularPrecios()`
- `cotizaciones.actions.ts` - Congelar al crear cotización
- NO hay `sincronizarPrecios()` - ya no es necesario

---

## ⚠️ Consideraciones Importantes

### **Gastos Fijos**
- Se almacenan en `project_servicio_gastos`
- El campo `gasto` en `project_servicios` es la **suma** de todos
- Se actualiza al agregar/modificar/eliminar gastos fijos

### **Migración de Datos Existentes**
- Columnas `utilidad` y `precio_publico` se eliminaron
- Datos legacy NO se pierden (se pueden recalcular)
- Cotizaciones históricas mantienen valores congelados

### **Performance**
- Cálculo es O(1) - muy rápido
- Se ejecuta en memoria, sin DB queries adicionales
- Impact negligible en UI rendering

---

## 🚀 Beneficios del Modelo

### **Flexibilidad**
- ✅ Ajuste de precios en tiempo real
- ✅ Testing de diferentes estrategias de pricing
- ✅ Cambios globales sin sincronización manual

### **Integridad**
- ✅ Cotizaciones nunca cambian retroactivamente
- ✅ Auditoría precisa de precios históricos
- ✅ Reportes confiables

### **Mantenibilidad**
- ✅ Lógica de cálculo en un solo lugar
- ✅ Fácil de debuggear
- ✅ Sin redundancia de datos

---

## 🔗 Referencias

- **Schema:** `prisma/schema.prisma`
- **Migración:** `supabase/migrations/20250929210000_remove_calculated_fields_from_servicios.sql`
- **Helper de cálculo:** `src/lib/actions/studio/config/catalogo.actions.ts`

---

**Última actualización:** 29 septiembre 2025  
**Autor:** Sistema de IA + Israel Wong
