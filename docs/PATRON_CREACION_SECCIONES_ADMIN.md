# Patrón de Creación de Secciones Administrativas

## 📋 **Introducción**

Este documento define el patrón estándar para crear nuevas secciones administrativas en la plataforma ProSocial. Basado en el análisis de las secciones existentes: **Agents**, **Pipeline**, **Canales**, **Leads**, etc.

## 🏗️ **Estructura de Directorios**

### **1. Estructura Principal**

```
src/app/admin/[seccion]/
├── page.tsx                    # Página principal (Server Component)
├── types.ts                    # Tipos TypeScript específicos
├── components/                 # Componentes específicos de la sección
│   ├── index.ts               # Barrel export
│   ├── [Seccion]PageClient.tsx # Componente cliente principal
│   ├── [Seccion]Container.tsx  # Container con lógica de negocio
│   ├── [Seccion]Card.tsx      # Card individual de elemento
│   ├── Stats.tsx              # Estadísticas de la sección
│   └── modals/                # Modales específicos
│       ├── Create[Seccion]Modal.tsx
│       ├── Edit[Seccion]Modal.tsx
│       └── Delete[Seccion]Modal.tsx
├── [id]/                      # Rutas dinámicas
│   ├── page.tsx              # Vista detalle
│   └── edit/
│       └── page.tsx          # Vista edición
└── new/                       # Crear nuevo elemento
    └── page.tsx
```

### **2. API Routes Correspondientes**

```
src/app/api/[seccion]/
├── route.ts                   # GET (lista) y POST (crear)
└── [id]/
    └── route.ts              # GET, PUT, DELETE por ID
```

### **3. Archivos de Soporte**

```
src/app/admin/_lib/actions/[seccion]/
├── [seccion].actions.ts       # Server Actions
├── [seccion].schemas.ts       # Schemas de validación (Zod)
└── index.ts                   # Exports
```

## 🎯 **Componentes Estándar**

### **1. Página Principal (Server Component)**

```typescript
// src/app/admin/[seccion]/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { [Seccion]PageClient } from './components';
import { [Seccion] } from './types';

// Función para obtener datos desde la base de datos
async function get[Seccion]s(): Promise<[Seccion][]> {
    try {
        const items = await prisma.prosocial_[tabla].findMany({
            include: {
                _count: {
                    select: {
                        prosocial_leads: true // Si aplica
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return items.map(item => ({
            ...item,
            // Conversiones necesarias (ej: Decimal → number)
        }));
    } catch (error) {
        console.error('Error fetching [seccion]:', error);

        let errorMessage = 'Error de conexión a la base de datos';

        if (error instanceof Error) {
            if (error.message.includes('permission denied')) {
                errorMessage = 'Permisos insuficientes para acceder a los datos.';
            } else if (error.message.includes('Tenant or user not found')) {
                errorMessage = 'Credenciales de base de datos incorrectas.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Tiempo de espera agotado.';
            } else {
                errorMessage = `Error de base de datos: ${error.message}`;
            }
        }

        throw new Error(errorMessage);
    }
}

export default async function [Seccion]Page() {
    let items: [Seccion][] = [];
    let error: string | null = null;

    try {
        items = await get[Seccion]s();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido';
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de [Seccion]</h1>
                        <p className="text-muted-foreground">
                            Administra [descripción de la sección]
                        </p>
                    </div>
                </div>

                {/* Error State */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-medium mb-2">Error al cargar [seccion]</h3>
                            <p className="text-red-300 text-sm mb-3">{error}</p>
                            <div className="text-red-300 text-sm space-y-1">
                                <p><strong>Posibles soluciones:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Verifica que las variables de entorno estén configuradas correctamente</li>
                                    <li>Confirma que el modelo prosocial_[tabla] existe en la base de datos</li>
                                    <li>Revisa las políticas RLS en la tabla prosocial_[tabla]</li>
                                    <li>Intenta recargar la página</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de [Seccion]</h1>
                    <p className="text-muted-foreground">
                        Administra [descripción de la sección]
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/[seccion]/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo [Elemento]
                    </Link>
                </Button>
            </div>

            {/* Client Components */}
            <[Seccion]PageClient initialItems={items} />
        </div>
    );
}
```

### **2. Tipos TypeScript**

```typescript
// src/app/admin/[seccion]/types.ts
export interface [Seccion] {
    id: string;
    nombre: string;
    descripcion?: string | null;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Campos específicos de la entidad
    _count?: {
        prosocial_leads: number;
    };
}

export interface [Seccion]FormData {
    nombre: string;
    descripcion?: string;
    activo: boolean;
    // Campos del formulario
}
```

### **3. Cliente Principal**

```typescript
// src/app/admin/[seccion]/components/[Seccion]PageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Stats } from './Stats';
import { [Seccion]Container } from './[Seccion]Container';
import { [Seccion] } from '../types';

interface [Seccion]PageClientProps {
    initialItems: [Seccion][];
}

export function [Seccion]PageClient({ initialItems }: [Seccion]PageClientProps) {
    const [items, setItems] = useState<[Seccion][]>(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleItemDelete = (itemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const handleItemUpdate = (updatedItem: [Seccion]) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    };

    return (
        <>
            {/* Stats Cards */}
            <Stats items={items} />

            {/* Filters and Items List */}
            <[Seccion]Container
                items={items}
                onItemDelete={handleItemDelete}
                onItemUpdate={handleItemUpdate}
            />
        </>
    );
}
```

### **4. API Routes**

```typescript
// src/app/api/[seccion]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.prosocial_[tabla].findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching [seccion]:", error);
    return NextResponse.json(
      { error: "Error al cargar [seccion]" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.prosocial_[tabla].create({
      data: body,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating [seccion]:", error);
    return NextResponse.json(
      { error: "Error al crear [elemento]" },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/[seccion]/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const item = await prisma.prosocial_[tabla].update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating [seccion]:", error);
    return NextResponse.json(
      { error: "Error al actualizar [elemento]" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.prosocial_[tabla].delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting [seccion]:", error);
    return NextResponse.json(
      { error: "Error al eliminar [elemento]" },
      { status: 500 }
    );
  }
}
```

## 🎨 **Patrones de UI Estándar**

### **1. Cards de Estadísticas**

```typescript
// Componente Stats estándar
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total [Elementos]</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
                {activeCount} activos
            </p>
        </CardContent>
    </Card>
    {/* Más cards... */}
</div>
```

### **2. Filtros y Búsqueda**

```typescript
// Sección de filtros estándar
<Card>
    <CardHeader>
        <CardTitle>Filtros y Búsqueda</CardTitle>
        <CardDescription>
            Encuentra [elementos] específicos usando los filtros
        </CardDescription>
    </CardHeader>
    <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Todos
                </Button>
                <Button
                    variant={filter === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilter('active')}
                >
                    Activos
                </Button>
                <Button
                    variant={filter === 'inactive' ? 'default' : 'outline'}
                    onClick={() => setFilter('inactive')}
                >
                    Inactivos
                </Button>
            </div>
        </div>
    </CardContent>
</Card>
```

### **3. Lista de Elementos**

```typescript
// Lista estándar con acciones
<Card>
    <CardHeader>
        <CardTitle>Lista de [Elementos]</CardTitle>
        <CardDescription>
            Gestiona todos los [elementos] del sistema
        </CardDescription>
    </CardHeader>
    <CardContent>
        <div className="space-y-4">
            {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{item.nombre}</h3>
                                <Badge variant={item.activo ? 'default' : 'secondary'}>
                                    {item.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {item.descripcion}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Botones de acción */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(item.id)}
                        >
                            {item.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    </CardContent>
</Card>
```

## 🔧 **Configuración y Navegación**

### **1. Actualizar Sidebar**

```typescript
// src/app/admin/components/Sidebar.tsx
// Agregar nueva sección al array de navegación
const navigationItems = [
  // ... items existentes
  {
    name: "[Seccion]",
    href: "/admin/[seccion]",
    icon: IconComponent,
    current: pathname === "/admin/[seccion]",
  },
];
```

### **2. Barrel Exports**

```typescript
// src/app/admin/[seccion]/components/index.ts
export { Stats } from './Stats';
export { [Seccion]Container } from './[Seccion]Container';
export { [Seccion]Card } from './[Seccion]Card';
export { [Seccion]PageClient } from './[Seccion]PageClient';
// Export modals
export * from './modals';
```

## 📝 **Checklist de Implementación**

### **Preparación**

- [ ] Definir el modelo en `schema.prisma`
- [ ] Crear migración de base de datos
- [ ] Definir tipos TypeScript
- [ ] Planificar campos y relaciones

### **Backend (API)**

- [ ] Crear API routes (`/api/[seccion]/route.ts`)
- [ ] Crear API routes por ID (`/api/[seccion]/[id]/route.ts`)
- [ ] Implementar validación de datos
- [ ] Manejar errores apropiadamente
- [ ] Probar endpoints con Postman/curl

### **Frontend (Páginas)**

- [ ] Crear página principal (`page.tsx`)
- [ ] Implementar Server Component con manejo de errores
- [ ] Crear tipos TypeScript específicos
- [ ] Implementar Client Component principal

### **Frontend (Componentes)**

- [ ] Crear componente Stats
- [ ] Crear componente Container
- [ ] Crear componente Card individual
- [ ] Implementar modales (Create/Edit/Delete)
- [ ] Crear barrel exports (`index.ts`)

### **Navegación y UX**

- [ ] Actualizar Sidebar con nueva sección
- [ ] Configurar rutas dinámicas ([id], new, edit)
- [ ] Implementar breadcrumbs si es necesario
- [ ] Agregar loading states

### **Testing y Validación**

- [ ] Probar CRUD completo
- [ ] Verificar manejo de errores
- [ ] Validar responsive design
- [ ] Probar estados vacíos y de carga
- [ ] Verificar accesibilidad básica

## 🎯 **Mejores Prácticas**

### **1. Nomenclatura Consistente**

- Usar PascalCase para componentes
- Usar camelCase para props y variables
- Usar snake_case para modelos Prisma
- Prefijo `prosocial_` para todas las tablas

### **2. Manejo de Estados**

- Server Components para data fetching inicial
- Client Components para interactividad
- Estados locales para UI temporal
- Optimistic updates cuando sea apropiado

### **3. Performance**

- Lazy loading para componentes pesados
- Paginación para listas grandes
- Debounce para búsquedas
- Memoización con React.memo cuando sea necesario

### **4. Accesibilidad**

- Semantic HTML correcto
- ARIA labels apropiados
- Keyboard navigation funcional
- Contraste de colores adecuado

### **5. Manejo de Errores**

- Error boundaries para componentes
- Estados de error informativos
- Fallbacks apropiados
- Logging consistente

## 📚 **Ejemplos de Referencia**

### **Secciones Implementadas**

1. **Agents** (`/admin/agents`) - Gestión de agentes comerciales
2. **Pipeline** (`/admin/pipeline`) - Etapas del proceso de ventas
3. **Canales** (`/admin/canales`) - Canales de adquisición
4. **Leads** (`/admin/leads`) - Gestión de leads

### **Próximas Secciones Sugeridas**

- **Campañas** (`/admin/campanas`) - Gestión de campañas publicitarias
- **Estudios** (`/admin/studios`) - Gestión de estudios fotográficos
- **Reportes** (`/admin/reportes`) - Reportes y analytics
- **Configuración** (`/admin/configuracion`) - Configuraciones del sistema

---

**Última actualización**: Septiembre 2025  
**Patrón basado en**: Agents, Pipeline, Canales  
**Próxima revisión**: Al implementar nuevas secciones
