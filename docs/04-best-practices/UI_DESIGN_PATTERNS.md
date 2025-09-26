# Patrones de Diseño UI - ProSocial Platform

## 📋 **Índice de Patrones**

- [Card Grouped List](#card-grouped-list) - Lista de elementos agrupados en una sola card
- [Pipeline Stages Layout](#pipeline-stages-layout) - Layout específico para etapas de pipeline
- [Admin Page Layout](#admin-page-layout) - Layout estándar para páginas de administración

---

## 🎯 **Card Grouped List**

### **Nombre del Patrón**

`card-grouped-list`

### **Descripción**

Patrón de diseño que agrupa múltiples elementos de lista dentro de una sola card contenedora, con separadores visuales entre elementos y funcionalidad de drag & drop.

### **Características Visuales**

- ✅ **Una sola card contenedora** que envuelve todos los elementos
- ✅ **Header con título y descripción** de la sección
- ✅ **Líneas divisorias** entre elementos (`divide-y divide-zinc-800`)
- ✅ **Hover effects** en cada elemento (`hover:bg-zinc-800/50`)
- ✅ **Indicador de reordenamiento** con spinner durante drag & drop

### **Estructura HTML**

```tsx
<Card className="border border-border bg-card shadow-sm">
  <CardHeader className="border-b border-zinc-800">
    <CardTitle className="text-lg font-semibold text-white">
      Título de la Sección
    </CardTitle>
    <div className="text-sm text-zinc-400">Descripción o instrucciones</div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="divide-y divide-zinc-800">
      {items.map((item) => (
        <div className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
          {/* Contenido del elemento */}
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

### **Elementos de Cada Fila**

```tsx
<div className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
  <div className="flex items-center space-x-4">
    {/* Handle de drag */}
    <div className="flex items-center space-x-2">
      <GripVertical className="h-4 w-4 text-zinc-500" />
      <span className="text-sm font-medium text-zinc-400 w-6">
        {item.order}
      </span>
    </div>

    {/* Indicador de color */}
    <div
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: item.color }}
    />

    {/* Contenido principal */}
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium text-white">{item.name}</h3>
        <Badge variant="outline" className="text-xs">
          {item.status}
        </Badge>
      </div>
      {item.description && (
        <p className="text-sm text-zinc-400">{item.description}</p>
      )}
    </div>
  </div>

  {/* Acciones */}
  <div className="flex items-center space-x-2">
    <Button variant="ghost" size="sm">
      <Icon className="h-4 w-4" />
    </Button>
  </div>
</div>
```

### **Implementación con Drag & Drop**

```tsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={items.map((item) => item.id)}
    strategy={verticalListSortingStrategy}
  >
    <div
      className={`divide-y divide-zinc-800 ${isReordering ? "pointer-events-none opacity-50" : ""}`}
    >
      {items.map((item) => (
        <SortableItem key={item.id} item={item} />
      ))}
    </div>
  </SortableContext>
</DndContext>
```

### **Estados Especiales**

#### **Loading State**

```tsx
<CardContent className="p-0">
  <div className="divide-y divide-zinc-800">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 animate-pulse"
      >
        <div className="flex items-center space-x-4">
          <div className="h-4 w-4 bg-zinc-700 rounded"></div>
          <div className="h-4 w-6 bg-zinc-700 rounded"></div>
          <div className="h-4 w-4 bg-zinc-700 rounded-full"></div>
          <div className="h-4 bg-zinc-700 rounded w-32"></div>
        </div>
      </div>
    ))}
  </div>
</CardContent>
```

#### **Estado de Reordenamiento**

```tsx
<div className="text-sm text-zinc-400">
  {isReordering ? (
    <span className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
      <span>Actualizando posición...</span>
    </span>
  ) : (
    "Arrastra para reordenar los elementos"
  )}
</div>
```

### **Casos de Uso**

- ✅ **Etapas de Pipeline** (`/admin/pipeline`)
- ✅ **Canales de Adquisición** (`/admin/canales`)
- ✅ **Servicios de Plataforma** (`/admin/services`)
- ✅ **Cualquier lista ordenable** con drag & drop

### **Ventajas**

- 🎨 **Consistencia visual** en toda la aplicación
- 📱 **Responsive** y adaptable
- ⚡ **Performance** optimizada con drag & drop
- 🔄 **UX intuitiva** con feedback visual
- 🎯 **Escalable** para cualquier número de elementos

---

## 🎯 **Pipeline Stages Layout**

### **Nombre del Patrón**

`pipeline-stages-layout`

### **Descripción**

Layout específico para páginas de administración que incluye estadísticas, instrucciones y lista de elementos con el patrón `card-grouped-list`.

### **Estructura Completa**

```tsx
<div className="space-y-6">
  {/* Header con botón de acción */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-white">Título de la Sección</h1>
      <p className="text-zinc-400">Descripción de la funcionalidad</p>
    </div>
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nuevo Elemento
    </Button>
  </div>

  {/* Cards de estadísticas */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Total</p>
            <p className="text-2xl font-bold text-white">{total}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    {/* Más cards de estadísticas... */}
  </div>

  {/* Sección de instrucciones */}
  <Card className="bg-zinc-900 border-zinc-800">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Instrucciones</h3>
      <ul className="space-y-2 text-sm text-zinc-400">
        <li className="flex items-start space-x-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Instrucción 1</span>
        </li>
        {/* Más instrucciones... */}
      </ul>
    </CardContent>
  </Card>

  {/* Lista con patrón card-grouped-list */}
  <CardGroupedList items={items} />
</div>
```

### **Casos de Uso**

- ✅ **Pipeline Stages** (`/admin/pipeline`)
- ✅ **Canales de Adquisición** (`/admin/canales`)
- ✅ **Servicios de Plataforma** (`/admin/services`)

---

## 🎯 **Admin Page Layout**

### **Nombre del Patrón**

`admin-page-layout`

### **Descripción**

Layout estándar para páginas de administración con header, estadísticas, instrucciones y contenido principal.

### **Estructura Base**

```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-white">Título</h1>
      <p className="text-zinc-400">Descripción</p>
    </div>
    <Button>Acción Principal</Button>
  </div>

  {/* Estadísticas */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Cards de estadísticas */}
  </div>

  {/* Instrucciones */}
  <Card className="bg-zinc-900 border-zinc-800">
    <CardContent className="p-6">
      {/* Contenido de instrucciones */}
    </CardContent>
  </Card>

  {/* Contenido principal */}
  <div>{/* Contenido específico de la página */}</div>
</div>
```

---

## 🚀 **Cómo Usar Estos Patrones**

### **En Conversaciones con IA**

```
"Aplica el patrón 'card-grouped-list' para la lista de [elementos]"
"Usa el layout 'pipeline-stages-layout' para la página de [sección]"
"Implementa el patrón 'admin-page-layout' para [página]"
```

### **Referencias Rápidas**

- **`card-grouped-list`**: Para listas ordenables con drag & drop
- **`pipeline-stages-layout`**: Para páginas con estadísticas + lista
- **`admin-page-layout`**: Para páginas de administración estándar

### **Archivos de Referencia**

- **Pipeline**: `src/app/admin/pipeline/components/DraggablePipelineStages.tsx`
- **Canales**: `src/app/admin/canales/components/CanalesList.tsx`
- **Servicios**: `src/app/admin/services/components/ServicesPageClient.tsx`

---

## 📝 **Notas de Implementación**

### **Dependencias Requeridas**

```json
{
  "@dnd-kit/core": "^6.0.8",
  "@dnd-kit/sortable": "^7.0.2",
  "@dnd-kit/utilities": "^3.2.1"
}
```

### **Imports Necesarios**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
```

### **Consideraciones de Performance**

- ✅ **Optimistic updates** para mejor UX
- ✅ **Debounced reordering** para evitar spam de requests
- ✅ **Loading states** para feedback visual
- ✅ **Error handling** con rollback automático

---

## 🎯 **Drag & Drop Anidado**

### **Nombre del Patrón**

`nested-drag-drop`

### **Descripción**

Patrón de diseño para implementar drag & drop con elementos anidados en categorías, permitiendo reordenamiento dentro de categorías y movimiento entre categorías.

### **Características Técnicas**

- ✅ **Actualización optimista** del estado local
- ✅ **Zonas de drop para categorías vacías** con feedback visual
- ✅ **Reindexación automática** de posiciones
- ✅ **Manejo de errores** con reversión de estado
- ✅ **Logging detallado** para debugging

### **Implementación**

Para implementación completa, consultar:
**[Guía de Drag & Drop Anidado](../02-implementation/NESTED_DRAG_DROP_GUIDE.md)**

### **Casos de Uso**

- Gestión de servicios por categorías
- Kanban boards con columnas
- Menús de navegación con submenús
- Listas de tareas organizadas por proyectos

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.1  
**Mantenido por**: Equipo de Desarrollo ProSocial
