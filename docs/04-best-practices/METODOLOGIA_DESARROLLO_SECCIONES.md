# Metodología Automatizada para Desarrollo de Secciones

## 🎯 **OBJETIVO**

Estandarizar el desarrollo de secciones en el studio mediante una metodología automatizada que garantice:

- **Consistencia** en la estructura de componentes
- **Reutilización** de patrones probados
- **Calidad** en la experiencia de usuario
- **Eficiencia** en el desarrollo

## 📋 **FLUJO AUTOMATIZADO**

### **Paso 1: Análisis de Ruta**

```
Usuario: "Revisa la ruta X aplica el flujo de creación A"
Agente: Analiza la ruta y identifica:
- Estructura de directorios
- Funcionalidades existentes
- Patrones de datos
- APIs relacionadas
```

### **Paso 2: Identificación de Componentes**

```
Agente: "He identificado los siguientes componentes necesarios:
- [ComponenteA] - Para [funcionalidad]
- [ComponenteB] - Para [funcionalidad]
- [ComponenteC] - Para [funcionalidad]
- [ComponenteD] - Para [funcionalidad]
- [ComponenteE] - Para [funcionalidad]

¿Estás de acuerdo? ¿Quieres agregar/omitir alguna funcionalidad?"
```

### **Paso 3: Confirmación y Creación**

```
Usuario: "Sí, procede"
Agente: Crea automáticamente todos los componentes siguiendo los templates
```

## 🏗️ **TEMPLATES DE COMPONENTES**

### **1. Componente de Estadísticas (Stats)**

```typescript
// Template: [Nombre]Stats.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { [Icono] } from 'lucide-react';

interface [Nombre]StatsProps {
    data: [TipoDatos];
    loading?: boolean;
}

export function [Nombre]Stats({ data, loading }: [Nombre]StatsProps) {
    if (loading) {
        return (
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                        <[Icono] className="h-5 w-5" />
                        <span>Estadísticas</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-zinc-700 rounded"></div>
                        <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                    <[Icono] className="h-5 w-5" />
                    <span>Estadísticas</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Contenido de estadísticas */}
            </CardContent>
        </Card>
    );
}
```

### **2. Componente de Lista (List)**

```typescript
// Template: [Nombre]List.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { [Nombre]Item } from './[Nombre]Item';
import { [TipoDatos] } from '../types';

interface [Nombre]ListProps {
    items: [TipoDatos][];
    onEdit: (item: [TipoDatos]) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
    loading?: boolean;
}

export function [Nombre]List({
    items,
    onEdit,
    onDelete,
    onAdd,
    loading
}: [Nombre]ListProps) {
    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white">[Título Lista]</CardTitle>
                        <CardDescription className="text-zinc-400">
                            [Descripción de la lista]
                        </CardDescription>
                    </div>
                    <Button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar [Elemento]
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-zinc-400">No hay [elementos] configurados</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Usa el botón "Agregar [Elemento]" para comenzar
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <[Nombre]Item
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
```

### **3. Componente de Item (Item)**

```typescript
// Template: [Nombre]Item.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, [IconoAccion] } from 'lucide-react';
import { ConfirmModal } from '@/app/studio/[slug]/components/ConfirmModal';
import { [TipoDatos] } from '../types';

interface [Nombre]ItemProps {
    item: [TipoDatos];
    onEdit: (item: [TipoDatos]) => void;
    onDelete: (id: string) => void;
}

export function [Nombre]Item({ item, onEdit, onDelete }: [Nombre]ItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await onDelete(item.id);
            setShowDeleteModal(false);
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex items-center space-x-3">
                    {/* Contenido del item */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">
                            {item.nombre || item.titulo || 'Sin nombre'}
                        </p>
                        <p className="text-zinc-400 text-xs">
                            {item.descripcion || 'Sin descripción'}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-1">
                        {/* Botón de acción principal */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Acción principal */}}
                            className="h-8 px-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                            title="[Acción principal]"
                        >
                            <[IconoAccion] className="h-3 w-3 mr-1" />
                            [Acción]
                        </Button>

                        {/* Botón de editar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                            title="Editar [elemento]"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>

                        {/* Botón de eliminar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                            title="Eliminar [elemento]"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar [elemento]"
                description={`¿Estás seguro de que quieres eliminar ${item.nombre || 'este elemento'}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
```

### **4. Componente de Modal (Modal)**

```typescript
// Template: [Nombre]Modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { [TipoDatos] } from '../types';

interface [Nombre]ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<[TipoDatos]>) => Promise<void>;
    editingItem?: [TipoDatos] | null;
    loading?: boolean;
}

export function [Nombre]Modal({
    isOpen,
    onClose,
    onSave,
    editingItem,
    loading = false
}: [Nombre]ModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                nombre: editingItem.nombre || '',
                descripcion: editingItem.descripcion || '',
                activo: editingItem.activo ?? true
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                activo: true
            });
        }
    }, [editingItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {editingItem ? 'Editar [Elemento]' : 'Agregar [Elemento]'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {editingItem
                            ? 'Modifica los datos del [elemento]'
                            : 'Completa la información del nuevo [elemento]'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-zinc-300">
                            Nombre *
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                            placeholder="Ingresa el nombre"
                            className="bg-zinc-800 border-zinc-600 text-white"
                            required
                            disabled={saving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-zinc-300">
                            Descripción
                        </Label>
                        <Input
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                            placeholder="Ingresa una descripción"
                            className="bg-zinc-800 border-zinc-600 text-white"
                            disabled={saving}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="activo"
                            checked={formData.activo}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
                            disabled={saving}
                        />
                        <Label htmlFor="activo" className="text-zinc-300">
                            Activo
                        </Label>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="w-full sm:w-auto border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || !formData.nombre.trim()}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {editingItem ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                editingItem ? 'Actualizar' : 'Crear'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
```

### **5. Archivo de Tipos (types.ts)**

```typescript
// Template: types.ts
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

## 🔄 **FLUJO DE IMPLEMENTACIÓN AUTOMATIZADA**

### **Comando de Activación:**

```
Usuario: "Revisa la ruta [RUTA] aplica el flujo de creación [NOMBRE_SECCION]"
```

### **Respuesta del Agente:**

```
Agente: "Perfecto, voy a revisar la ruta [RUTA] y aplicar la metodología de desarrollo de secciones.

🔍 ANÁLISIS DE LA RUTA:
- Ruta: [RUTA]
- Sección: [NOMBRE_SECCION]
- Funcionalidades identificadas: [LISTA]

📋 COMPONENTES NECESARIOS:
1. [Nombre]Stats - Para mostrar estadísticas y métricas
2. [Nombre]List - Para mostrar la lista principal con header
3. [Nombre]Item - Para cada elemento individual con acciones
4. [Nombre]Modal - Para crear y editar elementos
5. types.ts - Para las interfaces TypeScript
6. [nombre].actions.ts - Server Actions para CRUD
7. [nombre]-schemas.ts - Schemas de validación Zod

🔧 FUNCIONALIDADES ESTÁNDAR:
- ✅ CRUD completo con Server Actions (Create, Read, Update, Delete)
- ✅ Validación con Zod schemas
- ✅ Estados de loading en todas las operaciones
- ✅ Toast notifications con Sonner
- ✅ Modal de confirmación para eliminación
- ✅ Validación de formularios
- ✅ Manejo de errores robusto
- ✅ Componentes modulares y reutilizables
- ✅ Revalidación de cache con revalidatePath
- ✅ Patrón singleton para Prisma client

¿Estás de acuerdo con esta estructura? ¿Quieres agregar/omitir alguna funcionalidad?"
```

### **Confirmación y Creación:**

```
Usuario: "Sí, procede"

Agente: "Perfecto, procedo con la creación automática de todos los componentes siguiendo la metodología estándar..."
```

### **6. Server Actions (actions.ts)**

```typescript
// Template: [nombre].actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { revalidatePath } from "next/cache";
import {
    [Nombre]CreateSchema,
    [Nombre]UpdateSchema,
    [Nombre]DeleteSchema,
    type [Nombre]CreateForm,
    type [Nombre]UpdateForm,
    type [Nombre]DeleteForm,
} from "@/lib/actions/schemas/[nombre]-schemas";

// Obtener datos de [nombre] del studio
export async function obtener[Nombre]Studio(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: {
                id: true,
                name: true,
                slug: true,
                // Campos específicos de [nombre]
            },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        return studio;
    });
}

// Crear nuevo [elemento]
export async function crear[Nombre](
    studioSlug: string,
    data: [Nombre]CreateForm
) {
    return await retryDatabaseOperation(async () => {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        const validatedData = [Nombre]CreateSchema.parse(data);

        const nuevo[Nombre] = await prisma.[tabla].create({
            data: {
                projectId: studio.id,
                ...validatedData,
            },
        });

        revalidatePath(`/studio/${studioSlug}/[seccion]`);
        return nuevo[Nombre];
    });
}

// Actualizar [elemento] existente
export async function actualizar[Nombre](
    [elemento]Id: string,
    data: [Nombre]UpdateForm
) {
    return await retryDatabaseOperation(async () => {
        const validatedData = [Nombre]UpdateSchema.parse(data);

        const [elemento]Actualizado = await prisma.[tabla].update({
            where: { id: [elemento]Id },
            data: validatedData,
        });

        revalidatePath(`/studio/[slug]/[seccion]`);
        return [elemento]Actualizado;
    });
}

// Eliminar [elemento]
export async function eliminar[Nombre]([elemento]Id: string) {
    return await retryDatabaseOperation(async () => {
        await prisma.[tabla].delete({
            where: { id: [elemento]Id },
        });

        revalidatePath(`/studio/[slug]/[seccion]`);
        return { success: true };
    });
}
```

### **7. Schemas de Validación (schemas.ts)**

```typescript
// Template: [nombre]-schemas.ts
import { z } from "zod";

export const [Nombre]CreateSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre es muy largo"),
    descripcion: z.string().optional(),
    activo: z.boolean().default(true),
});

export type [Nombre]CreateForm = z.infer<typeof [Nombre]CreateSchema>;

export const [Nombre]UpdateSchema = z.object({
    id: z.string().min(1, "ID requerido"),
    nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre es muy largo").optional(),
    descripcion: z.string().optional(),
    activo: z.boolean().optional(),
});

export type [Nombre]UpdateForm = z.infer<typeof [Nombre]UpdateSchema>;

export const [Nombre]DeleteSchema = z.object({
    id: z.string().min(1, "ID requerido"),
});

export type [Nombre]DeleteForm = z.infer<typeof [Nombre]DeleteSchema>;
```

## 📁 **ESTRUCTURA DE ARCHIVOS GENERADA**

```
src/app/studio/[slug]/[seccion]/
├── page.tsx                    # Página principal
├── types.ts                    # Interfaces TypeScript
└── components/
    ├── [Nombre]Stats.tsx       # Estadísticas
    ├── [Nombre]List.tsx        # Lista principal
    ├── [Nombre]Item.tsx        # Item individual
    └── [Nombre]Modal.tsx       # Modal CRUD

src/lib/actions/studio/config/
├── [nombre].actions.ts         # Server Actions

src/lib/actions/schemas/
├── [nombre]-schemas.ts         # Schemas de validación
```

## 🎯 **BENEFICIOS DE LA METODOLOGÍA**

### **Para el Desarrollador:**

- ✅ **Consistencia** en todas las secciones
- ✅ **Velocidad** de desarrollo
- ✅ **Calidad** garantizada
- ✅ **Mantenibilidad** mejorada

### **Para el Usuario:**

- ✅ **Experiencia uniforme** en toda la aplicación
- ✅ **Interfaz intuitiva** y familiar
- ✅ **Funcionalidades completas** desde el inicio
- ✅ **Rendimiento optimizado**

### **Para el Proyecto:**

- ✅ **Escalabilidad** mejorada
- ✅ **Documentación** automática
- ✅ **Testing** más fácil
- ✅ **Refactoring** simplificado

## 🚀 **PRÓXIMOS PASOS**

1. **Implementar** los templates en el sistema
2. **Crear** comandos de activación
3. **Probar** con una nueva sección
4. **Refinar** basado en feedback
5. **Documentar** casos de uso específicos
