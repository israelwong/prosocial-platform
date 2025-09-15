# Mejores Prácticas para Componentes CRUD

## 📋 **Checklist de Implementación**

Cada vez que se cree un nuevo componente CRUD, el agente IA debe preguntar si se desean implementar estas mejoras:

### **1. 🎯 Actualización en Tiempo Real**
- [ ] **Sincronización de estado local** con props del servidor
- [ ] **Router refresh** después de operaciones CRUD
- [ ] **Revalidación de cache** con `revalidatePath`
- [ ] **Callbacks de éxito** en modales y formularios

### **2. 🔔 Sistema de Notificaciones**
- [ ] **Toast notifications** para feedback inmediato
- [ ] **Notificaciones persistentes** en base de datos
- [ ] **Diferentes tipos**: success, error, warning, info
- [ ] **Categorización**: general, lead, agent, pipeline, etc.

### **3. 🎨 Experiencia de Usuario**
- [ ] **Estados de carga** en botones y formularios
- [ ] **Feedback visual** durante operaciones
- [ ] **Manejo de errores** con mensajes claros
- [ ] **Confirmaciones** para acciones destructivas

### **4. 🔄 Drag & Drop (cuando aplique)**
- [ ] **DND Kit** para reordenamiento
- [ ] **Feedback visual** durante arrastre
- [ ] **Persistencia** del nuevo orden
- [ ] **Manejo de errores** con reversión

---

## 🏗️ **Estructura de Componentes**

### **Componente Principal (Server Component)**
```typescript
// src/app/admin/[section]/page.tsx
import { prisma } from '@/lib/prisma';
import { [Section]PageClient } from './components/[Section]PageClient';

async function get[Section]Data() {
    // Lógica de obtención de datos
}

export default async function [Section]Page() {
    const data = await get[Section]Data();
    return <[Section]PageClient data={data} />;
}
```

### **Componente Cliente (Client Component)**
```typescript
// src/app/admin/[section]/components/[Section]PageClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { [Section]Modal } from './[Section]Modal';
import { [Section]List } from './[Section]List';

export function [Section]PageClient({ data }: { data: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const router = useRouter();

    const handleSuccess = () => {
        router.refresh(); // ✅ Actualización en tiempo real
    };

    return (
        <div>
            {/* UI del componente */}
            <[Section]Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                onSuccess={handleSuccess} // ✅ Callback de éxito
            />
        </div>
    );
}
```

### **Modal/Formulario**
```typescript
// src/app/admin/[section]/components/[Section]Modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // ✅ Toast notifications

interface [Section]ModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: any;
    onSuccess?: () => void; // ✅ Callback de éxito
}

export function [Section]Modal({ isOpen, onClose, item, onSuccess }: [Section]ModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});

    // ✅ Sincronizar formulario con datos de edición
    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            setFormData({});
        }
    }, [item, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await [action](formData);
            
            if (result.success) {
                toast.success('Operación exitosa'); // ✅ Toast de éxito
                onClose();
                if (onSuccess) onSuccess(); // ✅ Notificar éxito
            } else {
                toast.error(result.error); // ✅ Toast de error
            }
        } catch (error) {
            toast.error('Error inesperado'); // ✅ Toast de error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {/* Formulario */}
                    <Button 
                        type="submit" 
                        disabled={isLoading} // ✅ Estado de carga
                    >
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
```

### **Lista con Drag & Drop**
```typescript
// src/app/admin/[section]/components/[Section]List.tsx
'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function [Section]List({ items, onEdit }: { items: any[], onEdit: (item: any) => void }) {
    const [localItems, setLocalItems] = useState(items);

    // ✅ Sincronizar estado local con props
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleDragEnd = async (event: DragEndEvent) => {
        // ✅ Lógica de reordenamiento
        const result = await reorderItems(newOrder);
        if (!result.success) {
            // ✅ Revertir en caso de error
            setLocalItems(items);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={localItems.map(item => item.id)}>
                {localItems.map(item => (
                    <SortableItem key={item.id} item={item} onEdit={onEdit} />
                ))}
            </SortableContext>
        </DndContext>
    );
}
```

---

## 🔔 **Sistema de Notificaciones**

### **Tipos de Notificaciones**
```typescript
// Tipos disponibles
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';
type NotificationCategory = 'general' | 'lead' | 'agent' | 'pipeline' | 'subscription' | 'appointment' | 'task';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
```

### **Crear Notificación**
```typescript
// src/lib/notifications.ts
import { prisma } from '@/lib/prisma';

export async function createNotification({
    userId,
    titulo,
    mensaje,
    tipo = 'info',
    categoria = 'general',
    priority = 'medium',
    metadata = null,
    scheduledFor = null,
    expiresAt = null,
    leadId = null,
    agentId = null
}: {
    userId: string;
    titulo: string;
    mensaje: string;
    tipo?: NotificationType;
    categoria?: NotificationCategory;
    priority?: NotificationPriority;
    metadata?: any;
    scheduledFor?: Date | null;
    expiresAt?: Date | null;
    leadId?: string | null;
    agentId?: string | null;
}) {
    return await prisma.proSocialNotification.create({
        data: {
            userId,
            titulo,
            mensaje,
            tipo,
            categoria,
            priority,
            metadata,
            scheduledFor,
            expiresAt,
            leadId,
            agentId
        }
    });
}
```

### **Ejemplos de Uso**
```typescript
// Notificación de éxito al crear lead
await createNotification({
    userId: currentUser.id,
    titulo: 'Nuevo Lead Creado',
    mensaje: `Se ha creado un nuevo lead: ${lead.nombre}`,
    tipo: 'success',
    categoria: 'lead',
    leadId: lead.id
});

// Recordatorio de cita
await createNotification({
    userId: agent.id,
    titulo: 'Recordatorio de Cita',
    mensaje: `Tienes una cita programada con ${lead.nombre} en 30 minutos`,
    tipo: 'reminder',
    categoria: 'appointment',
    priority: 'high',
    scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    metadata: { leadId: lead.id, appointmentTime: appointmentTime }
});
```

---

## 🎯 **Server Actions**

### **Estructura Estándar**
```typescript
// src/app/admin/[section]/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';

export async function create[Section](formData: FormData) {
    try {
        // Validación
        const data = validateFormData(formData);
        
        // Crear en base de datos
        const item = await prisma.[model].create({ data });
        
        // ✅ Revalidar cache
        revalidatePath('/admin/[section]');
        
        // ✅ Crear notificación
        await createNotification({
            userId: currentUser.id,
            titulo: '[Section] Creado',
            mensaje: `Se ha creado ${item.nombre}`,
            tipo: 'success',
            categoria: '[section]'
        });
        
        return { success: true, item };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

---

## 📝 **Preguntas para el Agente IA**

Cuando se solicite crear un nuevo componente, el agente debe preguntar:

1. **¿Deseas implementar actualización en tiempo real?**
   - Sincronización de estado local
   - Router refresh automático
   - Callbacks de éxito

2. **¿Deseas implementar sistema de notificaciones?**
   - Toast notifications
   - Notificaciones persistentes
   - Diferentes tipos y categorías

3. **¿Deseas implementar drag & drop?**
   - Reordenamiento de elementos
   - Feedback visual
   - Persistencia del orden

4. **¿Deseas implementar estados de carga?**
   - Botones con loading
   - Feedback visual
   - Manejo de errores

5. **¿Deseas implementar confirmaciones?**
   - Para acciones destructivas
   - Para operaciones críticas

---

## 🚀 **Beneficios de Implementar Estas Mejoras**

- ✅ **Experiencia de usuario fluida** sin recargas de página
- ✅ **Feedback inmediato** con notificaciones
- ✅ **Interfaz reactiva** que se actualiza en tiempo real
- ✅ **Manejo robusto de errores** con mensajes claros
- ✅ **Operaciones intuitivas** con drag & drop
- ✅ **Estados visuales claros** durante operaciones

---

## 📚 **Referencias**

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [DND Kit](https://dndkit.com/)
- [Sonner Toast](https://sonner.emilkowal.ski/)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
