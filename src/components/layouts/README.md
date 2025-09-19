# Section Navigation Components

Componentes reutilizables e inteligentes para crear headers y navegación interna en secciones del admin.

## Características Inteligentes

El componente se adapta automáticamente:

- ✅ **Con navegación** - Si pasas `navigationItems`, muestra tabs de navegación
- ✅ **Sin navegación** - Si no pasas `navigationItems`, solo muestra header simple
- ✅ **Flexible** - Un solo componente para todos los casos de uso
- ✅ **Iconos por nombre** - Acepta strings para iconos (compatible con Server Components)

## Cuándo Usar Layout vs Componente Directo

### ✅ Usar Layout (SectionLayout) - Para secciones con subsecciones:

- **Campañas** - Tiene subsecciones (Activas, Historial, Plataformas)
- **Cualquier sección** que tenga navegación interna

### ✅ Usar Componente Directo (SectionNavigation) - Para páginas simples:

- **Agentes** - Solo una página principal
- **Planes** - Solo una página principal
- **Servicios** - Solo una página principal
- **Cualquier página** que no tenga subsecciones

## Cuándo NO Usar

Este componente **NO debe usarse** en secciones como:

- ❌ **Planes** - Solo muestra lista de planes
- ❌ **Servicios** - Solo muestra lista de servicios
- ❌ **Canales** - Solo muestra lista de canales
- ❌ **Descuentos** - Solo muestra lista de descuentos
- ❌ **Pipeline** - Solo muestra configuración del pipeline

Estas secciones son simples y no necesitan navegación interna.

## Componentes

### 1. `SectionNavigation`

Componente base para la navegación interna con header y tabs.

```tsx
import { SectionNavigation } from "@/components/ui/section-navigation";
import { Play, History, Settings } from "lucide-react";

const navigationItems = [
  {
    name: "Activas",
    href: "/admin/campanas/activas",
    icon: Play,
    description: "Campañas en curso",
  },
  {
    name: "Historial",
    href: "/admin/campanas/historial",
    icon: History,
    description: "Campañas finalizadas",
  },
];

<SectionNavigation
  title="Campañas"
  description="Gestiona tus campañas de marketing"
  navigationItems={navigationItems}
  actionButton={{
    label: "Nueva Campaña",
    href: "/admin/campanas/activas",
    icon: Plus,
  }}
/>;
```

### 2. `SectionLayout`

Layout wrapper que incluye la navegación y el contenedor de contenido.

```tsx
import { SectionLayout } from "@/components/layouts/section-layout";

<SectionLayout
  title="Campañas"
  description="Gestiona tus campañas de marketing"
  navigationItems={navigationItems}
  actionButton={actionButton}
>
  {/* Contenido de la página */}
  <div className="p-6">
    <h2>Contenido aquí</h2>
  </div>
</SectionLayout>;
```

## Props

### `SectionNavigationProps`

| Prop              | Tipo               | Descripción                    |
| ----------------- | ------------------ | ------------------------------ |
| `title`           | `string`           | Título principal de la sección |
| `description`     | `string`           | Descripción de la sección      |
| `navigationItems` | `NavigationItem[]` | Array de items de navegación   |
| `actionButton?`   | `ActionButton`     | Botón de acción opcional       |
| `className?`      | `string`           | Clases CSS adicionales         |

### `NavigationItem`

| Prop          | Tipo         | Descripción         |
| ------------- | ------------ | ------------------- |
| `name`        | `string`     | Nombre del tab      |
| `href`        | `string`     | URL del tab         |
| `icon`        | `LucideIcon` | Icono del tab       |
| `description` | `string`     | Descripción del tab |

### `ActionButton`

| Prop    | Tipo         | Descripción     |
| ------- | ------------ | --------------- |
| `label` | `string`     | Texto del botón |
| `href`  | `string`     | URL del botón   |
| `icon`  | `LucideIcon` | Icono del botón |

## Ejemplos de Uso

### ✅ Con Navegación Interna (Campañas)

```tsx
<SectionLayout
  title="Campañas"
  description="Gestiona tus campañas de marketing"
  navigationItems={[
    {
      name: "Activas",
      href: "/admin/campanas/activas",
      icon: Play,
      description: "Campañas en curso",
    },
    {
      name: "Historial",
      href: "/admin/campanas/historial",
      icon: History,
      description: "Campañas finalizadas",
    },
    {
      name: "Plataformas",
      href: "/admin/campanas/plataformas",
      icon: Settings,
      description: "Gestionar plataformas",
    },
  ]}
  actionButton={{
    label: "Nueva Campaña",
    href: "/admin/campanas/activas",
    icon: Plus,
  }}
>
  {children}
</SectionLayout>
```

### ✅ Uso Directo en Página (Agentes)

```tsx
// En la página principal (page.tsx)
<SectionNavigation
  title="Gestión de Agentes"
  description="Administra los agentes comerciales y su rendimiento"
  actionButton={{ label: "Nuevo Agente", href: "/admin/agents/new", icon: "UserPlus" }}
/>

<div className="bg-zinc-900 border border-zinc-800 rounded-lg">
  {/* Contenido de la página */}
</div>
```

### ✅ Uso Directo en Página (Planes)

```tsx
// En la página principal (page.tsx)
<SectionNavigation
  title="Planes"
  description="Gestiona los planes de suscripción de tu plataforma"
  actionButton={{ label: "Nuevo Plan", href: "/admin/plans/nuevo", icon: "Plus" }}
/>

<div className="bg-zinc-900 border border-zinc-800 rounded-lg">
  {/* Contenido de la página */}
</div>
```

### ✅ Campañas (SÍ usar - tiene subsecciones)

```tsx
const campaignNavigation = [
  {
    name: "Activas",
    href: "/admin/campanas/activas",
    icon: Play,
    description: "Campañas en curso",
  },
  {
    name: "Historial",
    href: "/admin/campanas/historial",
    icon: History,
    description: "Campañas finalizadas",
  },
  {
    name: "Plataformas",
    href: "/admin/campanas/plataformas",
    icon: Settings,
    description: "Gestionar plataformas",
  },
];
```

### ✅ Ejemplo: Si Agentes tuviera subsecciones (hipotético)

```tsx
// Solo usar si realmente tuviera subsecciones como:
const agentNavigation = [
  {
    name: "Agentes",
    href: "/admin/agents",
    icon: Users,
    description: "Lista de agentes",
  },
  {
    name: "Estadísticas",
    href: "/admin/agents/estadisticas",
    icon: BarChart3,
    description: "Métricas y rendimiento",
  },
];
```

### ✅ Ejemplo: Si Estudios tuviera subsecciones (hipotético)

```tsx
// Solo usar si realmente tuviera subsecciones como:
const studioNavigation = [
  {
    name: "Estudios",
    href: "/admin/studios",
    icon: Building2,
    description: "Lista de estudios",
  },
  {
    name: "Suscriptores",
    href: "/admin/studios/suscriptores",
    icon: Users,
    description: "Gestión de suscriptores",
  },
];
```

### ❌ Ejemplos de secciones que NO deben usar este componente:

- **Planes** - Solo una lista de planes
- **Servicios** - Solo una lista de servicios
- **Canales** - Solo una lista de canales
- **Descuentos** - Solo una lista de descuentos
- **Pipeline** - Solo configuración del pipeline

## Características

- ✅ **Reutilizable** - Se puede usar en cualquier sección
- ✅ **Consistente** - Mismo diseño en toda la aplicación
- ✅ **Responsive** - Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible** - Navegación por teclado y screen readers
- ✅ **Tipado** - Completamente tipado con TypeScript
- ✅ **Flexible** - Botón de acción opcional
- ✅ **Temático** - Usa el tema oscuro de la aplicación

## Estructura de Archivos

```
src/
├── components/
│   ├── ui/
│   │   └── section-navigation.tsx    # Componente base
│   └── layouts/
│       ├── section-layout.tsx        # Layout wrapper
│       └── README.md                 # Esta documentación
└── app/
    └── admin/
        ├── campanas/
        │   └── layout.tsx            # ✅ Layout con navegación interna
        ├── agents/
        │   └── page.tsx              # ✅ Uso directo del componente
        └── pipeline/
            └── components/
                └── PipelineWrapper.tsx # ✅ Wrapper con lógica específica
```

**Nota:**

- **Layouts** solo para secciones con subsecciones (como Campañas)
- **Uso directo** para páginas simples (como Agentes, Planes)
- **Wrappers** para casos especiales con lógica compleja (como Pipeline)

## Iconos Disponibles

El componente acepta iconos como string para compatibilidad con Server Components:

```tsx
// ✅ Iconos disponibles como string
icon: "UserPlus" |
  "Plus" |
  "Settings" |
  "BarChart3" |
  "Calendar" |
  "Users" |
  "Building2" |
  "Target" |
  "TrendingUp";

// ✅ También acepta componentes directamente (solo en Client Components)
icon: UserPlus; // Solo en componentes client-side
```

**Ventaja**: Los strings son serializables y funcionan en Server Components, mientras que los componentes solo funcionan en Client Components.
