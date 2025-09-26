# Comandos de Automatización para Desarrollo de Secciones

## 🎯 **COMANDO PRINCIPAL**

### **Activación del Flujo:**

```
Revisa la ruta [RUTA] aplica el flujo de creación [NOMBRE_SECCION]
```

**Ejemplos:**

- `Revisa la ruta /studio/[slug]/configuracion/catalogo aplica el flujo de creación catalogo`
- `Revisa la ruta /studio/[slug]/contactos aplica el flujo de creación contactos`
- `Revisa la ruta /studio/[slug]/finanzas aplica el flujo de creación finanzas`

## 🔍 **ANÁLISIS AUTOMÁTICO DEL AGENTE**

### **Paso 1: Análisis de Ruta**

El agente debe:

1. **Leer** la estructura de directorios de la ruta
2. **Identificar** archivos existentes (page.tsx, API routes, etc.)
3. **Analizar** funcionalidades actuales
4. **Detectar** patrones de datos y APIs

### **Paso 2: Identificación de Componentes**

El agente debe identificar:

- **¿Existe botón eliminar?** → Crear `[Nombre]Item` con `ConfirmModal`
- **¿Existe botón crear/agregar?** → Crear `[Nombre]Modal` para CRUD
- **¿Existe estadísticas/métricas?** → Crear `[Nombre]Stats`
- **¿Existe lista de elementos?** → Crear `[Nombre]List`
- **¿Existe formulario?** → Integrar en `[Nombre]Modal`

### **Paso 3: Propuesta de Componentes**

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

¿Estás de acuerdo con esta estructura? ¿Quieres agregar/omitir alguna funcionalidad?"
```

## ✅ **CONFIRMACIÓN DEL USUARIO**

### **Respuestas Aceptadas:**

- `Sí, procede`
- `Perfecto, adelante`
- `Está bien, continúa`
- `Sí, está correcto`

### **Respuestas con Modificaciones:**

- `Sí, pero omite [componente]`
- `Perfecto, pero agrega [funcionalidad]`
- `Está bien, pero cambia [aspecto]`

## 🚀 **CREACIÓN AUTOMÁTICA**

### **Orden de Creación:**

1. **`types.ts`** - Interfaces TypeScript
2. **`[Nombre]Stats.tsx`** - Componente de estadísticas
3. **`[Nombre]List.tsx`** - Componente de lista
4. **`[Nombre]Item.tsx`** - Componente de item individual
5. **`[Nombre]Modal.tsx`** - Componente de modal CRUD
6. **Actualizar `page.tsx`** - Integrar todos los componentes

### **Verificaciones Automáticas:**

- ✅ **Imports correctos** con paths absolutos
- ✅ **TypeScript** sin errores
- ✅ **Linting** sin warnings
- ✅ **Estructura** de directorios correcta
- ✅ **Funcionalidades** completas

## 📋 **TEMPLATES ESPECÍFICOS POR TIPO**

### **Para Secciones de Configuración:**

- **Stats**: Métricas de configuración
- **List**: Lista de configuraciones
- **Item**: Configuración individual con toggle
- **Modal**: Formulario de configuración

### **Para Secciones de Datos:**

- **Stats**: Contadores y métricas
- **List**: Lista de registros
- **Item**: Registro individual con acciones
- **Modal**: Formulario de datos

### **Para Secciones de Gestión:**

- **Stats**: KPIs y estadísticas
- **List**: Lista de elementos
- **Item**: Elemento con acciones múltiples
- **Modal**: Formulario complejo

## 🔧 **PERSONALIZACIONES COMUNES**

### **Campos Específicos por Sección:**

#### **Redes Sociales:**

- `url` (string, validación URL)
- `plataformaId` (string, select)
- `activo` (boolean, switch)

#### **Contactos:**

- `nombre` (string, required)
- `email` (string, validación email)
- `telefono` (string, optional)
- `activo` (boolean, switch)

#### **Servicios:**

- `nombre` (string, required)
- `descripcion` (string, optional)
- `precio` (number, required)
- `activo` (boolean, switch)

#### **Proyectos:**

- `titulo` (string, required)
- `descripcion` (string, optional)
- `fechaInicio` (date, required)
- `fechaFin` (date, optional)
- `estado` (string, select)

## 📝 **EJEMPLO COMPLETO DE IMPLEMENTACIÓN**

### **Comando:**

```
Revisa la ruta /studio/[slug]/configuracion/catalogo aplica el flujo de creación catalogo
```

### **Respuesta del Agente:**

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

## 🎯 **BENEFICIOS DE ESTA AUTOMATIZACIÓN**

### **Para el Desarrollador:**

- ✅ **Velocidad**: Desarrollo 5x más rápido
- ✅ **Consistencia**: Misma estructura en todas las secciones
- ✅ **Calidad**: Patrones probados y optimizados
- ✅ **Mantenibilidad**: Código estándar y documentado

### **Para el Proyecto:**

- ✅ **Escalabilidad**: Fácil agregar nuevas secciones
- ✅ **Estándares**: Metodología unificada
- ✅ **Testing**: Patrones consistentes para pruebas
- ✅ **Refactoring**: Cambios globales más fáciles

### **Para el Usuario:**

- ✅ **Experiencia uniforme**: Misma interfaz en toda la app
- ✅ **Funcionalidades completas**: CRUD, validaciones, errores
- ✅ **Rendimiento**: Componentes optimizados
- ✅ **Accesibilidad**: Patrones accesibles implementados
