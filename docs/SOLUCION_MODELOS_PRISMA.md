# Solución: Problemas de Nomenclatura de Modelos Prisma

## 📋 **Problema Identificado**

### **Descripción del Error**

Error recurrente en múltiples componentes del sistema donde las consultas Prisma fallan con el mensaje:

```
TypeError: Cannot read properties of undefined (reading 'findMany')
```

### **Causa Raíz**

**Inconsistencia en la nomenclatura de modelos Prisma** entre el código TypeScript y el schema de la base de datos.

- **Código incorrecto**: Uso de `camelCase` para nombres de modelos
- **Schema correcto**: Uso de `snake_case` según definición en `schema.prisma`

## 🔍 **Casos Identificados y Solucionados**

### **1. Agentes Comerciales**

**Archivo afectado**: `src/app/admin/agents/page.tsx`

```typescript
// ❌ Incorrecto
await prisma.proSocialAgent.findMany();

// ✅ Correcto
await prisma.prosocial_agents.findMany();
```

### **2. Pipeline de Ventas**

**Archivo afectado**: `src/app/admin/pipeline/page.tsx`

```typescript
// ❌ Incorrecto
await prisma.proSocialPipelineStage.findMany();

// ✅ Correcto
await prisma.prosocial_pipeline_stages.findMany();
```

### **3. Canales de Adquisición**

**Archivos afectados**:

- `src/app/api/canales/route.ts`
- `src/app/api/canales/[id]/route.ts`

```typescript
// ❌ Incorrecto
await prisma.proSocialCanalAdquisicion.findMany();

// ✅ Correcto
await prisma.prosocial_canales_adquisicion.findMany();
```

### **4. CRM Kanban**

**Archivo afectado**: `src/app/admin/crm/kanban/page.tsx`

```typescript
// ❌ Incorrecto
await prisma.proSocialLead.findMany({
    include: {
        agent: { ... },
        etapa: { ... },
        canalAdquisicion: { ... }
    }
});

// ✅ Correcto
await prisma.prosocial_leads.findMany({
    include: {
        prosocial_agents: { ... },
        prosocial_pipeline_stages: { ... },
        prosocial_canales_adquisicion: { ... }
    }
});
```

## 🛠️ **Metodología de Solución**

### **Paso 1: Identificación del Error**

```bash
# Error típico en terminal
Error fetching [entidad]: TypeError: Cannot read properties of undefined (reading 'findMany')
```

### **Paso 2: Verificar el Schema Prisma**

```bash
# Buscar el modelo correcto en schema.prisma
grep -n "model prosocial_" prisma/schema.prisma
```

### **Paso 3: Corregir la Nomenclatura**

```typescript
// Reemplazar en todos los archivos afectados
// De: prisma.camelCaseModel
// A:  prisma.snake_case_model
```

### **Paso 4: Verificar Relaciones**

```typescript
// Asegurar que las relaciones también usen nombres correctos
include: {
  _count: {
    select: {
      prosocial_leads: true; // ✅ snake_case
    }
  }
}
```

### **Paso 5: Validar Funcionamiento**

```bash
# Probar endpoints
curl -s http://localhost:3000/api/[entidad]

# Verificar páginas
curl -s http://localhost:3000/admin/[entidad] | grep -c "[título]"
```

## 📚 **Referencia de Modelos Correctos**

### **Modelos Principales**

| Entidad        | Nombre Correcto en Prisma       | Archivo Schema |
| -------------- | ------------------------------- | -------------- |
| Agentes        | `prosocial_agents`              | Línea 584      |
| Pipeline       | `prosocial_pipeline_stages`     | Línea 742      |
| Canales        | `prosocial_canales_adquisicion` | Línea 641      |
| Leads          | `prosocial_leads`               | Línea 678      |
| Campañas       | `prosocial_campanas`            | Línea 615      |
| Notificaciones | `prosocial_notifications`       | Línea 714      |

### **Relaciones Importantes**

```typescript
// Agentes → Leads
prosocial_agents: {
    prosocial_leads: prosocial_leads[]  // Relación uno a muchos
}

// Pipeline → Leads
prosocial_pipeline_stages: {
    prosocial_leads: prosocial_leads[]  // Relación uno a muchos
}

// Canales → Leads
prosocial_canales_adquisicion: {
    prosocial_leads: prosocial_leads[]  // Relación uno a muchos
}
```

## ⚡ **Patrón de Consulta Optimizada**

### **Consulta con Conteo de Relaciones**

```typescript
const entities = await prisma.prosocial_[entity].findMany({
  include: {
    _count: {
      select: {
        prosocial_leads: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc", // o el campo apropiado
  },
});
```

### **Manejo de Errores Estándar**

```typescript
try {
  const data = await prisma.prosocial_[entity].findMany(/* query */);
  return data.map((item) => ({
    ...item,
    // Conversiones necesarias (ej: Decimal → number)
    comisionConversion: Number(item.comisionConversion),
  }));
} catch (error) {
  console.error("Error fetching [entity]:", error);

  let errorMessage = "Error de conexión a la base de datos";

  if (error instanceof Error) {
    if (error.message.includes("permission denied")) {
      errorMessage = "Permisos insuficientes para acceder a los datos.";
    } else if (error.message.includes("Tenant or user not found")) {
      errorMessage = "Credenciales de base de datos incorrectas.";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Tiempo de espera agotado.";
    } else {
      errorMessage = `Error de base de datos: ${error.message}`;
    }
  }

  throw new Error(errorMessage);
}
```

## 🔧 **Herramientas de Verificación**

### **Comando de Búsqueda de Errores**

```bash
# Buscar uso incorrecto de camelCase en modelos
grep -r "prisma\.[A-Z]" src/app --include="*.ts" --include="*.tsx"
```

### **Validar Schema Prisma**

```bash
# Generar cliente actualizado
npx prisma generate

# Verificar conexión
npx prisma db pull --schema=./prisma/schema.prisma
```

### **Probar Endpoints**

```bash
# Script de prueba rápida
for endpoint in agents pipeline canales; do
    echo "Testing $endpoint..."
    curl -s "http://localhost:3000/api/$endpoint" | head -1
done
```

## 🚨 **Prevención de Errores Futuros**

### **1. Usar TypeScript Estricto**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### **2. Validación con ESLint**

```javascript
// Regla personalizada para detectar modelos incorrectos
"no-restricted-syntax": [
    "error",
    {
        "selector": "MemberExpression[object.name='prisma'][property.name=/^[A-Z]/]",
        "message": "Use snake_case para modelos Prisma, no camelCase"
    }
]
```

### **3. Documentación de Referencia**

Mantener este documento actualizado con:

- Nuevos modelos agregados
- Cambios en nomenclatura
- Casos especiales identificados

### **4. Testing Automatizado**

```typescript
// Test unitario para verificar modelos
describe("Prisma Models", () => {
  it("should use correct model names", () => {
    expect(prisma.prosocial_agents).toBeDefined();
    expect(prisma.prosocial_pipeline_stages).toBeDefined();
    expect(prisma.prosocial_canales_adquisicion).toBeDefined();
  });
});
```

## 📝 **Checklist de Solución**

Cuando encuentres un error similar:

- [ ] Identificar el mensaje de error específico
- [ ] Verificar el nombre del modelo en `schema.prisma`
- [ ] Buscar todas las ocurrencias del modelo incorrecto
- [ ] Reemplazar con la nomenclatura correcta
- [ ] Verificar relaciones y campos anidados
- [ ] Probar la funcionalidad completa
- [ ] Actualizar documentación si es necesario

## 🎯 **Resultados Esperados**

Después de aplicar esta solución:

✅ **Consultas Prisma funcionando correctamente**
✅ **APIs devolviendo datos reales**
✅ **Páginas cargando sin errores**
✅ **Relaciones y conteos precisos**
✅ **Logs limpios sin errores de conexión**

## 📋 **Resumen de Archivos Corregidos**

### **✅ Componentes de Página**

1. **`src/app/admin/agents/page.tsx`** - Gestión de agentes comerciales
2. **`src/app/admin/pipeline/page.tsx`** - Pipeline de ventas
3. **`src/app/admin/crm/kanban/page.tsx`** - CRM Kanban board

### **✅ API Routes**

1. **`src/app/api/canales/route.ts`** - API de canales (GET/POST)
2. **`src/app/api/canales/[id]/route.ts`** - API de canales por ID (PUT/DELETE)

### **✅ Mejoras Implementadas**

- ✅ Corrección de nomenclatura de modelos Prisma
- ✅ Corrección de nombres de relaciones en includes
- ✅ Manejo robusto de errores con mensajes específicos
- ✅ Conversión correcta de tipos Decimal a Number
- ✅ Definición de interfaces TypeScript apropiadas
- ✅ Estados de error informativos para el usuario

---

**Última actualización**: Septiembre 2025  
**Casos resueltos**: Agentes, Pipeline, Canales de Adquisición, CRM Kanban  
**Próxima revisión**: Al agregar nuevos modelos al sistema
