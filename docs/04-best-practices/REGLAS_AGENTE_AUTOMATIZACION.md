# Reglas para el Agente IA - Automatización de Secciones

## 🎯 **REGLA PRINCIPAL**

**Cuando el usuario use el comando:**

```
"Revisa la ruta [RUTA] aplica el flujo de creación [NOMBRE_SECCION]"
```

**El agente DEBE seguir este flujo exacto:**

## 📋 **FLUJO OBLIGATORIO**

### **Paso 1: Análisis de Ruta y Git (OBLIGATORIO)**

1. **Leer** la estructura de directorios de la ruta especificada
2. **Identificar** archivos existentes (page.tsx, API routes, etc.)
3. **Analizar** funcionalidades actuales
4. **Detectar** patrones de datos y APIs relacionadas
5. **Analizar** rama actual de Git (`git branch --show-current`)
6. **Verificar** ramas existentes con patrón similar
7. **Proponer** estrategia de rama Git

### **Paso 2: Identificación de Componentes (OBLIGATORIO)**

**SIEMPRE identificar estos componentes:**

- **¿Existe botón eliminar?** → Crear `[Nombre]Item` con `ConfirmModal`
- **¿Existe botón crear/agregar?** → Crear `[Nombre]Modal` para CRUD
- **¿Existe estadísticas/métricas?** → Crear `[Nombre]Stats`
- **¿Existe lista de elementos?** → Crear `[Nombre]List`
- **¿Existe formulario?** → Integrar en `[Nombre]Modal`

### **Paso 3: Propuesta de Componentes (OBLIGATORIO)**

**SIEMPRE mostrar esta estructura:**

```
Agente: "He identificado los siguientes componentes necesarios:

1. [Nombre]Stats - Para mostrar estadísticas y métricas
2. [Nombre]List - Para mostrar la lista principal con header y botón agregar
3. [Nombre]Item - Para cada elemento individual con acciones (visitar, editar, eliminar)
4. [Nombre]Modal - Para crear y editar elementos
5. types.ts - Para las interfaces TypeScript

🔧 FUNCIONALIDADES ESTÁNDAR:
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Estados de loading en todas las operaciones
- ✅ Toast notifications con Sonner
- ✅ Modal de confirmación para eliminación
- ✅ Validación de formularios
- ✅ Manejo de errores robusto
- ✅ Componentes modulares y reutilizables

🌿 GESTIÓN DE RAMA GIT:
- Rama actual: [RAMA_ACTUAL]
- Patrón detectado: [PATRON]
- Rama propuesta: [RAMA_PROPUESTA]
- Acción: [CREAR/ITERAR/CONFIRMAR]
- Razón: [EXPLICACIÓN]

¿Estás de acuerdo con esta estructura? ¿Quieres agregar/omitir alguna funcionalidad?"
```

### **Paso 4: Esperar Confirmación (OBLIGATORIO)**

**NO proceder** hasta que el usuario confirme con:

- `Sí, procede`
- `Perfecto, adelante`
- `Está bien, continúa`
- `Sí, está correcto`

### **Paso 5: Gestión de Rama Git (OBLIGATORIO)**

**SIEMPRE ejecutar antes de crear componentes:**

1. **Analizar** rama actual (`git branch --show-current`)
2. **Verificar** ramas existentes con patrón similar
3. **Determinar** acción (crear/iterar/confirmar)
4. **Crear** nueva rama si es necesario
5. **Confirmar** cambio de rama

### **Paso 6: Creación Automática (OBLIGATORIO)**

**SIEMPRE crear en este orden:**

1. **`types.ts`** - Interfaces TypeScript
2. **`[Nombre]Stats.tsx`** - Componente de estadísticas
3. **`[Nombre]List.tsx`** - Componente de lista
4. **`[Nombre]Item.tsx`** - Componente de item individual
5. **`[Nombre]Modal.tsx`** - Componente de modal CRUD
6. **Actualizar `page.tsx`** - Integrar todos los componentes
7. **Commit automático** - Con mensaje descriptivo

## 🔧 **TEMPLATES OBLIGATORIOS**

### **1. types.ts (OBLIGATORIO)**

```typescript
export interface [Nombre] {
    id: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface [Nombre]Create {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
}

export interface [Nombre]Update {
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}
```

### **2. [Nombre]Stats.tsx (OBLIGATORIO)**

- **SIEMPRE** incluir estado de loading
- **SIEMPRE** usar Card de shadcn/ui
- **SIEMPRE** seguir tema oscuro zinc
- **SIEMPRE** incluir icono de Lucide React

### **3. [Nombre]List.tsx (OBLIGATORIO)**

- **SIEMPRE** incluir header con título y botón agregar
- **SIEMPRE** usar Card de shadcn/ui
- **SIEMPRE** incluir estado de loading
- **SIEMPRE** mostrar mensaje cuando no hay elementos
- **SIEMPRE** mapear elementos con [Nombre]Item

### **4. [Nombre]Item.tsx (OBLIGATORIO)**

- **SIEMPRE** incluir ConfirmModal para eliminación
- **SIEMPRE** incluir botones de acción (editar, eliminar)
- **SIEMPRE** usar estados de loading
- **SIEMPRE** seguir tema oscuro zinc
- **SIEMPRE** incluir iconos de Lucide React

### **5. [Nombre]Modal.tsx (OBLIGATORIO)**

- **SIEMPRE** usar Dialog de shadcn/ui
- **SIEMPRE** incluir validación de formularios
- **SIEMPRE** incluir estados de loading
- **SIEMPRE** manejar creación y edición
- **SIEMPRE** seguir tema oscuro zinc

## 🎨 **ESTILOS OBLIGATORIOS**

### **Tema Oscuro Zinc (OBLIGATORIO)**

```css
/* Colores principales */
bg-zinc-950    /* Fondo principal */
bg-zinc-900    /* Cards y contenedores */
bg-zinc-800    /* Bordes y separadores */
text-white     /* Texto principal */
text-zinc-300  /* Texto secundario */
```

### **Componentes UI (OBLIGATORIO)**

- **shadcn/ui** como base de componentes
- **Lucide React** para iconos
- **Tailwind CSS** para estilos
- **Sonner** para notificaciones toast

## 🔄 **FUNCIONALIDADES OBLIGATORIAS**

### **CRUD Completo (OBLIGATORIO)**

- ✅ **Create**: Modal para crear nuevos elementos
- ✅ **Read**: Lista con todos los elementos
- ✅ **Update**: Modal para editar elementos existentes
- ✅ **Delete**: ConfirmModal para eliminar elementos

### **Estados de Loading (OBLIGATORIO)**

- ✅ **Loading en listas**: Skeleton o spinner
- ✅ **Loading en modales**: Botón con spinner
- ✅ **Loading en eliminación**: Modal con spinner
- ✅ **Loading en formularios**: Inputs deshabilitados

### **Manejo de Errores (OBLIGATORIO)**

- ✅ **Toast notifications**: Sonner para éxito y error
- ✅ **Try-catch**: En todas las operaciones asíncronas
- ✅ **Mensajes específicos**: Errores descriptivos
- ✅ **Fallbacks**: Estados de error apropiados

### **Validación (OBLIGATORIO)**

- ✅ **Formularios**: Validación de campos requeridos
- ✅ **URLs**: Validación de formato URL
- ✅ **Emails**: Validación de formato email
- ✅ **Números**: Validación de rangos y tipos

## 📁 **ESTRUCTURA DE ARCHIVOS (OBLIGATORIA)**

```
src/app/studio/[slug]/[seccion]/
├── page.tsx                    # Página principal
├── types.ts                    # Interfaces TypeScript
└── components/
    ├── [Nombre]Stats.tsx       # Estadísticas
    ├── [Nombre]List.tsx        # Lista principal
    ├── [Nombre]Item.tsx        # Item individual
    └── [Nombre]Modal.tsx       # Modal CRUD
```

## 🚨 **REGLAS ESTRICTAS**

### **NO HACER (PROHIBIDO)**

- ❌ **NO usar** `alert()` o `confirm()` nativos
- ❌ **NO usar** `any` type en TypeScript
- ❌ **NO usar** paths relativos para imports
- ❌ **NO usar** colores que no sean del tema zinc
- ❌ **NO crear** componentes sin estados de loading
- ❌ **NO crear** formularios sin validación
- ❌ **NO crear** operaciones sin manejo de errores

### **SIEMPRE HACER (OBLIGATORIO)**

- ✅ **SIEMPRE usar** ConfirmModal para eliminaciones
- ✅ **SIEMPRE usar** toast notifications
- ✅ **SIEMPRE usar** paths absolutos para imports
- ✅ **SIEMPRE usar** tema oscuro zinc
- ✅ **SIEMPRE incluir** estados de loading
- ✅ **SIEMPRE incluir** validación de formularios
- ✅ **SIEMPRE incluir** manejo de errores

## 🔍 **VERIFICACIONES OBLIGATORIAS**

### **Después de Crear Cada Componente:**

1. **Verificar** imports correctos
2. **Verificar** TypeScript sin errores
3. **Verificar** linting sin warnings
4. **Verificar** funcionalidades completas
5. **Verificar** tema oscuro aplicado

### **Al Final de la Implementación:**

1. **Verificar** que todos los componentes funcionan
2. **Verificar** que no hay errores de build
3. **Verificar** que la experiencia de usuario es fluida
4. **Verificar** que sigue la metodología estándar

## 📝 **EJEMPLO DE IMPLEMENTACIÓN CORRECTA**

### **Comando del Usuario:**

```
Revisa la ruta /studio/[slug]/configuracion/catalogo aplica el flujo de creación catalogo
```

### **Respuesta Correcta del Agente:**

```
🔍 ANÁLISIS DE LA RUTA:
- Ruta: /studio/[slug]/configuracion/catalogo
- Sección: Catálogo de Servicios
- Funcionalidades identificadas: CRUD de servicios, precios, categorías

📋 COMPONENTES NECESARIOS:
1. CatalogoStats - Para mostrar estadísticas del catálogo (total servicios, categorías, etc.)
2. CatalogoList - Para mostrar la lista de servicios con header y botón agregar
3. CatalogoItem - Para cada servicio individual con acciones (ver, editar, eliminar)
4. CatalogoModal - Para crear y editar servicios
5. types.ts - Para las interfaces TypeScript (Servicio, Categoria, etc.)

🔧 FUNCIONALIDADES ESTÁNDAR:
- ✅ CRUD completo de servicios
- ✅ Estados de loading en todas las operaciones
- ✅ Toast notifications con Sonner
- ✅ Modal de confirmación para eliminación
- ✅ Validación de formularios (nombre, precio, categoría)
- ✅ Manejo de errores robusto
- ✅ Componentes modulares y reutilizables

¿Estás de acuerdo con esta estructura? ¿Quieres agregar/omitir alguna funcionalidad?
```

### **Después de Confirmación:**

```
Agente: "Perfecto, procedo con la creación automática de todos los componentes siguiendo la metodología estándar..."

✅ Creando types.ts...
✅ Creando CatalogoStats.tsx...
✅ Creando CatalogoList.tsx...
✅ Creando CatalogoItem.tsx...
✅ Creando CatalogoModal.tsx...
✅ Actualizando page.tsx...

🎉 ¡Implementación completada! Todos los componentes han sido creados siguiendo la metodología estándar.
```

## 🎯 **OBJETIVO FINAL**

**Garantizar que TODAS las secciones del studio sigan la misma metodología, estructura y calidad, proporcionando una experiencia de usuario consistente y un código mantenible.**
