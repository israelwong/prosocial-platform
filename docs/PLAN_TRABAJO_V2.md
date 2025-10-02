# 📋 PLAN DE TRABAJO V2.0 - Tracking Detallado

**Branch:** `v2-foundation`  
**Inicio:** 2 de Octubre, 2025  
**Meta:** MVP Studio funcional en 2 semanas

---

## 🎯 RESUMEN EJECUTIVO

| Fase                        | Duración       | Estado         | Completado       |
| --------------------------- | -------------- | -------------- | ---------------- |
| **Fase 0: Fundamentos**     | 3-4 días       | 🟢 En progreso | 67% (2.5/4 días) |
| **Iteración 1: Studio MVP** | 2-3 semanas    | ⚪ Pendiente   | 0%               |
| ├─ Refactorización          | 4 días         | ⚪ Pendiente   | 0%               |
| ├─ Módulo Manager           | 7 días         | ⚪ Pendiente   | 0%               |
| └─ Limpieza                 | 2 días         | ⚪ Pendiente   | 0%               |
| **Iteración 2: Admin**      | 1.5 semanas    | ⚪ Pendiente   | 0%               |
| **Iteración 3: Agente CRM** | 1 semana       | ⚪ Pendiente   | 0%               |
| **Iteración 4: ZEN Magic**  | 3 días         | ⚪ Pendiente   | 0%               |

---

## 🔷 FASE 0: FUNDAMENTOS (3-4 días)

**Objetivo:** Base de datos V2.0 completa + Sistema de módulos funcional

### **📅 Día 1: Arquitectura de Base de Datos** ✅ COMPLETADO

#### Database Schema Transformation

- [x] Crear rama `backup-pre-v2` (respaldo seguro)
- [x] Crear rama `v2-foundation` (trabajo activo)
- [x] Renombrar modelo `projects` → `studios`
- [x] Cambiar TODAS las propiedades `projectId` → `studio_id`
- [x] Aplicar `snake_case` a TODAS las columnas
- [x] Renombrar TODAS las tablas `project_*` → `studio_*`
- [x] Agregar prefijos `platform_*` o `studio_*` a tablas ambiguas

#### Nuevos Modelos V2.0

- [x] Sistema de Módulos: `platform_modules`, `studio_modules`
- [x] Usuarios Multi-Contexto: `users`, `user_platform_roles`, `user_studio_roles`, `studio_role_permissions`
- [x] Pipelines Marketing: `marketing_pipeline_stages`, `marketing_leads`, `marketing_lead_activities`, `marketing_quotes`, `marketing_lead_notes`
- [x] Pipelines Manager: `manager_pipeline_stages`, `manager_events`, `manager_event_tasks`, `manager_event_deliverables`, `manager_event_team`
- [x] Gantt Templates: `gantt_templates`, `gantt_template_tasks`, `gantt_event_instances`, `gantt_event_tasks`, `gantt_task_activity`

#### Validación

- [x] `npx prisma validate` sin errores
- [x] `npx prisma format` aplicado
- [x] Commit con mensaje descriptivo
- [x] Documentar en `docs/DECISIONES_V2.md`

**Resultado:** Schema 2,117 líneas, 100% validado ✅

---

### **📅 Día 2: Migración + Seeds Base** ✅ COMPLETADO

#### Aplicar Migración ✅ COMPLETADO

- [x] Respaldar base de datos actual (rama backup-pre-v2)
- [x] `npx prisma migrate reset --force` (base de datos limpia)
- [x] `npx prisma migrate dev --name init_v2_architecture`
- [x] `npx prisma generate` (cliente TypeScript generado)
- [x] Verificar que no hay errores de migración

#### Seed: Módulos Platform ✅ COMPLETADO

```typescript
// prisma/seeds/modules-seed.ts ✅
- [x] Crear seed de platform_modules:
  - [x] ZEN Manager (CORE, incluido en todos)
  - [x] ZEN Magic (CORE, planes Pro+)
  - [x] ZEN Marketing (CORE, planes Pro+)
  - [x] ZEN Payment (ADDON, +$10 USD/mes)
  - [x] ZEN Cloud (ADDON, +$15 USD/mes)
  - [x] ZEN Conversations (ADDON, +$15 USD/mes)
  - [x] ZEN Invitation (ADDON, +$12 USD/mes)
```

#### Seed: Usuarios de Prueba ✅ COMPLETADO

```typescript
// prisma/seed-v2.ts (integrado) ✅
- [x] Crear usuarios base:
  - [x] Super Admin (platform_role: SUPER_ADMIN)
  - [x] Studio Owner de prueba (platform_role: SUSCRIPTOR + studio_role: OWNER)
```

#### Activar Módulos en Studios ✅ COMPLETADO

```typescript
// prisma/seed-v2.ts (integrado) ✅
- [x] Activar módulos core en studio de prueba:
  - [x] ZEN Manager → is_active: true
  - [x] ZEN Magic → is_active: true
  - [x] ZEN Marketing → is_active: true
```

#### Seed: Pipelines V2.0 ✅ COMPLETADO

```typescript
// prisma/seeds/pipelines-v2-seed.ts ✅
- [x] Marketing Pipeline (7 stages):
  - [x] Lead Nuevo, Contactado, Calificado
  - [x] Propuesta Enviada, Negociación
  - [x] Ganado, Perdido
- [x] Manager Pipeline (7 stages):
  - [x] Planeación, Preparación, Producción
  - [x] Post-Producción, Entrega, Garantía, Completado
```

#### Seed: Tipos de Evento ✅ COMPLETADO

```typescript
- [x] Boda, XV Años, Sesión Familiar, Sesión Embarazo
```

#### Helper Functions ✅ COMPLETADO

```typescript
// src/lib/modules/index.ts ✅
- [x] Crear helper `checkStudioModule(studioId, moduleSlug)` - Validación BÁSICA (sin planes)
- [x] Crear helper `getActiveModules(studioId)` - Listar módulos activos
- [x] Crear helper `getModuleInfo(moduleSlug)` - Info de módulo específico
- [x] Crear helper `checkMultipleModules(studioId, moduleSlugs[])` - Verificación múltiple
- [x] Crear helper `getAllModulesWithStatus(studioId)` - Todos los módulos con estado
- [x] Testing manual exitoso (8 tests pasados)
- [x] Documentación completa en README.md

NOTA: Validación completa con planes (checkStudioModuleWithPlan) → Iteración 2 (Admin)
```

**Criterio de Éxito:**

- ✅ Migración sin errores
- ✅ Base de datos con modelos V2.0
- ✅ Módulos creados y activados
- ✅ Pipelines V2.0 funcionando
- ✅ Usuarios y studio demo creados
- ⚪ Helpers → Día 3

**Tiempo real:** 6 horas

---

### **📅 Día 3: Pipelines + Stages Seeds** ⚪ Pendiente

#### Seed: Marketing Pipeline (CRM)

```typescript
// prisma/seeds/marketing-pipeline-seed.ts
- [ ] Stages por defecto para Marketing:
  - [ ] Lead Nuevo (PROSPECTING, orden: 0)
  - [ ] Contactado (PROSPECTING, orden: 1)
  - [ ] Calificado (QUALIFICATION, orden: 2)
  - [ ] Propuesta Enviada (PROPOSAL, orden: 3)
  - [ ] Negociación (PROPOSAL, orden: 4)
  - [ ] Ganado (CONVERSION, orden: 5, is_system: true)
  - [ ] Perdido (CLOSED_LOST, orden: 6, is_system: true)
```

#### Seed: Manager Pipeline (Operacional)

```typescript
// prisma/seeds/manager-pipeline-seed.ts
- [ ] Stages por defecto para Manager:
  - [ ] Planeación (PLANNING, orden: 0)
  - [ ] Preparación (PLANNING, orden: 1)
  - [ ] Producción (PRODUCTION, orden: 2)
  - [ ] Post-Producción (POST_PRODUCTION, orden: 3)
  - [ ] Revisión Cliente (REVIEW, orden: 4)
  - [ ] Entrega (DELIVERY, orden: 5)
  - [ ] Completado (COMPLETED, orden: 6, is_system: true)
```

#### Testing de Pipelines

```typescript
- [ ] Crear lead de prueba en Marketing
- [ ] Mover lead entre stages
- [ ] Convertir lead a evento (Manager)
- [ ] Validar relación bidireccional
```

**Criterio de Éxito:**

- ✅ Stages de ambos pipelines creados
- ✅ Leads y eventos de prueba funcionan
- ✅ Flujo de conversión Lead → Evento funciona

**Tiempo estimado:** 3-4 horas

---

### **📅 Día 4: Gantt Templates Seeds** ⚪ Pendiente

#### Seed: Templates Básicos

```typescript
// prisma/seeds/gantt-templates-seed.ts
- [ ] Template "Boda Standard" (45 días, 15 tareas)
  - [ ] Pre-evento: Reunión inicial, visita locación, sesión pre-boda, preparar equipo
  - [ ] Evento: Cobertura del evento
  - [ ] Post-evento: Backup, selección, edición, revisión, entrega

- [ ] Template "Sesión Familiar Express" (7 días, 4 tareas)
  - [ ] Coordinar locación
  - [ ] Sesión fotográfica
  - [ ] Selección y edición
  - [ ] Entrega digital

- [ ] Template "XV Años" (30 días, 12 tareas)
  - [ ] Similar a boda pero más corto
```

#### Testing de Gantt

```typescript
- [ ] Crear evento de prueba
- [ ] Aplicar template "Boda Standard"
- [ ] Verificar que se crean tareas con fechas calculadas
- [ ] Asignar tarea a usuario
- [ ] Marcar tarea como completada
- [ ] Validar progreso del evento
```

#### Documentación

```markdown
- [ ] Actualizar README con setup de base de datos
- [ ] Documentar sistema de módulos
- [ ] Documentar pipelines duales
- [ ] Documentar Gantt templates
```

**Criterio de Éxito:**

- ✅ Templates creados y funcionando
- ✅ Aplicación de templates funciona
- ✅ Cálculo de fechas correcto
- ✅ Documentación actualizada

**Tiempo estimado:** 4-5 horas

---

## ✅ CHECKLIST FASE 0 COMPLETA

Antes de iniciar Iteración 1, validar:

- [ ] Base de datos migrada sin errores
- [ ] Prisma client generado correctamente
- [ ] Módulos activados en studio de prueba
- [ ] Helpers de módulos funcionando
- [ ] Ambos pipelines con stages creados
- [ ] Templates Gantt funcionando
- [ ] Seeds ejecutados exitosamente
- [ ] Documentación actualizada
- [ ] Commit de Fase 0 completa
- [ ] Sin errores en consola

---

## 🔷 ITERACIÓN 1: STUDIO MVP (2-3 semanas)

**Objetivo:** Refactorizar Studio a arquitectura modular + Módulo ZEN Manager funcional

> 📖 **Análisis detallado:** Ver `docs/ARQUITECTURA_STUDIO_V2.md` para auditoría completa

### **⚠️ PRIORIDAD: REFACTORIZACIÓN MODULAR**

**Contexto:** Studio actual tiene estructura legacy que necesita migración a V2.0 antes de continuar

**Decisiones clave:**
1. ✅ Configuración CENTRALIZADA con secciones por módulo (híbrido)
2. ✅ Sidebar dinámico basado en `getActiveModules()`
3. ✅ Middleware de validación en cada módulo
4. ✅ Responsive puede esperar (Desktop-first aceptable por ahora)

---

### **📅 FASE 1: REFACTORIZACIÓN (4 días) - PREREQUISITO**

#### Día 5-6: Migración de Configuración (2 días)

**Objetivo:** Reorganizar `/configuracion` con arquitectura modular V2.0

```typescript
// Nueva estructura de configuración
/configuracion/
├── estudio/           # Config base (identidad, contacto, horarios)
├── cuenta/            # Config usuario (perfil, notificaciones)
├── modulos/           # ⭐ NUEVO: Gestión de módulos
└── [modulo]/          # Config por módulo (solo si activo)
    ├── manager/       # Config ZEN Manager
    ├── marketing/     # Config ZEN Marketing
    └── magic/         # Config ZEN Magic
```

**Tareas:**
- [ ] Crear `/configuracion/modulos/page.tsx`
  - [ ] Usar `getAllModulesWithStatus(studioId)`
  - [ ] Mostrar módulos CORE (activos)
  - [ ] Mostrar módulos ADDON (con precio, placeholder)
- [ ] Migrar config de `/catalogo` a `/manager`
  - [ ] Mover tipos-evento a `/manager/tipos-evento`
  - [ ] Mover servicios a `/manager/servicios`
  - [ ] Mover paquetes a `/manager/paquetes`
- [ ] Refactorizar `ConfiguracionSidebarZen.tsx`
  - [ ] Lógica dinámica con `getActiveModules()`
  - [ ] Mostrar secciones solo si módulo activo
  - [ ] Iconos por módulo
- [ ] Actualizar Server Actions de configuración
  - [ ] Cambiar `projects` → `studios`
  - [ ] Cambiar `project_*` → `studio_*`
  - [ ] Validar tipos con Prisma V2.0

**Criterio de éxito:**
- ✅ Configuración base funciona (estudio, cuenta)
- ✅ Página de módulos muestra correctamente
- ✅ Sidebar dinámico funciona
- ✅ 0 referencias a `projects` en `/configuracion`

**Tiempo estimado:** 2 días (16 horas)

---

#### Día 7-8: Dashboard Global + Sidebar Modular (2 días)

**Objetivo:** Dashboard cross-módulo + Sidebar dinámico por módulos activos

```typescript
// Dashboard Sidebar V2.0
Dashboard (siempre)
├─ Vista General
└─ Notificaciones

─────────────────────

ZEN Manager (si activo)
├─ Kanban Operacional
├─ Eventos
├─ Agenda
└─ Finanzas

ZEN Marketing (si activo)
├─ Kanban CRM
├─ Leads
└─ Cotizaciones

ZEN Magic (si activo)
└─ Asistente IA

─────────────────────

Configuración (siempre)
```

**Tareas:**
- [ ] Crear `/dashboard/page.tsx` limpio
  - [ ] Metrics cards con datos reales
  - [ ] Query eventos del mes
  - [ ] Query pagos pendientes
  - [ ] Query próximos eventos
- [ ] Refactorizar `DashboardSidebarZen.tsx`
  - [ ] Obtener módulos activos con `getActiveModules()`
  - [ ] Renderizar secciones condicionalmente
  - [ ] Dashboard siempre visible
  - [ ] Configuración siempre visible
  - [ ] Módulos solo si activos
- [ ] Crear Server Actions de Dashboard
  - [ ] `getMonthMetrics(studioId, month)`
  - [ ] `getUpcomingEvents(studioId, days)`
  - [ ] `getPendingPayments(studioId)`

**Criterio de éxito:**
- ✅ Dashboard muestra métricas reales
- ✅ Sidebar dinámico funciona correctamente
- ✅ Solo módulos activos aparecen en menú
- ✅ Navegación fluida entre secciones

**Tiempo estimado:** 2 días (16 horas)

---

### **📅 FASE 2: MÓDULO MANAGER (1 semana)**

#### Día 9-10: Estructura Manager + Kanban Base (2 días)

**Objetivo:** Crear estructura del módulo Manager con middleware + Kanban básico

```
src/app/studio/[slug]/manager/
├── layout.tsx                # Middleware con checkStudioModule()
├── page.tsx                  # Redirect a /kanban
├── kanban/
│   └── page.tsx             # Vista Kanban
├── eventos/
│   └── [id]/
│       ├── page.tsx         # Detalle del evento
│       └── gantt/
│           └── page.tsx     # Timeline (placeholder)
└── agenda/
    └── page.tsx             # Calendario (placeholder)
```

**Tareas:**
- [ ] Crear `/manager/layout.tsx` con middleware
- [ ] Crear `/manager/kanban/page.tsx` básica
  - [ ] Obtener `manager_pipeline_stages` del studio
  - [ ] Obtener `manager_events` agrupados por stage
  - [ ] Renderizar columnas (sin drag & drop aún)
- [ ] Componentes base
  - [ ] `KanbanBoard.tsx` - Container principal
  - [ ] `KanbanColumn.tsx` - Columna por stage
  - [ ] `EventoCard.tsx` - Info básica del evento

**Server Actions:**
```typescript
// src/lib/actions/studio/manager/eventos.actions.ts
- getEventosKanban(studioId: string)
- getPipelineStages(studioId: string)
```

**Criterio de éxito:**
- ✅ Middleware protege ruta `/manager`
- ✅ Kanban muestra columnas con eventos
- ✅ Cards muestran info básica de eventos

**Tiempo estimado:** 2 días (16 horas)

---

#### Día 11-12: Drag & Drop + Modal CRUD Eventos (2 días)

**Objetivo:** Drag & drop funcional + CRUD completo de eventos

**Tareas:**
- [ ] Implementar Drag & Drop (dnd-kit)
  - [ ] Instalar `@dnd-kit/core` y `@dnd-kit/sortable`
  - [ ] DndContext en KanbanBoard
  - [ ] Draggable en EventoCard
  - [ ] Droppable en KanbanColumn
  - [ ] Optimistic updates
- [ ] EventoModal (CRUD)
  - [ ] Formulario con ZEN components
  - [ ] Campos: nombre, cliente, tipo evento, fecha, venue, valor
  - [ ] Validación con Zod
  - [ ] Estados de loading y error
- [ ] Filtros y búsqueda
  - [ ] Filtro por tipo de evento
  - [ ] Filtro por rango de fechas
  - [ ] Search por nombre/cliente

**Server Actions:**
```typescript
- crearEvento(studioId, data)
- actualizarEvento(eventoId, data)
- moverEventoEtapa(eventoId, nuevaEtapaId)
- eliminarEvento(eventoId)
```

**Criterio de éxito:**
- ✅ Drag & drop funcional entre stages
- ✅ Crear evento desde modal
- ✅ Editar evento existente
- ✅ Filtros funcionan correctamente

**Tiempo estimado:** 2 días (16 horas)

---

#### Día 13-14: Sistema Gantt Básico (2 días)

**Objetivo:** Aplicar templates Gantt a eventos + visualización timeline

**Tareas:**
- [ ] Página `/manager/eventos/[id]/gantt/page.tsx`
  - [ ] Vista timeline del evento
  - [ ] Selector de template (si no tiene)
  - [ ] Lista de tareas con fechas
  - [ ] Marcar tarea completada
  - [ ] Indicadores de progreso (%)
- [ ] Modal aplicar template
  - [ ] Selector de templates del studio
  - [ ] Preview del template
  - [ ] Confirmar aplicación
- [ ] Server Actions Gantt
  - [ ] `aplicarTemplate(eventoId, templateId)`
  - [ ] `actualizarTarea(tareaId, data)`
  - [ ] `completarTarea(tareaId)`
- [ ] Componentes
  - [ ] `GanttTimeline.tsx`
  - [ ] `GanttTaskRow.tsx`
  - [ ] `ApplyTemplateModal.tsx`

**Criterio de éxito:**
- ✅ Eventos pueden tener templates aplicados
- ✅ Tareas se crean automáticamente
- ✅ Progreso se calcula correctamente
- ✅ Tareas pueden marcarse como completadas

**Tiempo estimado:** 2 días (16 horas)

---

#### Día 15: Agenda + Testing Final (1 día)

**Objetivo:** Calendario de eventos + testing end-to-end

**Tareas:**
- [ ] Página `/manager/agenda/page.tsx`
  - [ ] Calendario mensual (FullCalendar o custom)
  - [ ] Eventos en el calendario
  - [ ] Códigos de color por tipo evento
  - [ ] Click evento → Modal detalle
- [ ] Testing end-to-end
  - [ ] Flujo completo: Crear → Aplicar template → Mover stage → Ver agenda
  - [ ] Testing responsive
  - [ ] Fix de bugs encontrados

**Criterio de éxito:**
- ✅ Agenda muestra eventos correctamente
- ✅ Flujo end-to-end funciona
- ✅ Sin errores en consola

**Tiempo estimado:** 1 día (8 horas)

---

### **📅 FASE 3: LIMPIEZA Y DOCUMENTACIÓN (2 días)**

#### Día 16-17: Refactoring + Documentación

**Tareas:**
- [ ] Eliminar código legacy
  - [ ] Código duplicado de `/studio/(main)` antiguo
  - [ ] Componentes no utilizados
  - [ ] Imports obsoletos
- [ ] Audit de Server Actions
  - [ ] Buscar todas las referencias a `project_*`
  - [ ] Reemplazar por `studio_*`
  - [ ] Validar tipos con Prisma V2.0
- [ ] Documentación
  - [ ] Actualizar README con nueva estructura
  - [ ] Documentar convenciones de módulos
  - [ ] Ejemplos de uso de helpers

**Criterio de éxito:**
- ✅ 0 referencias a `projects` en código
- ✅ Código limpio y mantenible
- ✅ Documentación actualizada

**Tiempo estimado:** 2 días (16 horas)

---

## 📊 MÉTRICAS DE ÉXITO POR FASE

### Fase 0

- ✅ 0 errores en migración
- ✅ Schema validado 100%
- ✅ Módulos funcionando
- ✅ Pipelines con data de prueba
- ✅ Templates Gantt aplicables

### Iteración 1 (Studio)

- 🎯 Crear evento completo end-to-end
- 🎯 Kanban drag & drop funcional
- 🎯 Aplicar template Gantt a evento
- 🎯 Ver agenda mensual de eventos
- 🎯 Asignar tareas a personal
- 🎯 Marcar progreso de tareas

---

## 🔄 TRACKING DE PROGRESO

### Cómo usar este documento:

1. ✅ Marcar checkboxes conforme se completan
2. 📝 Agregar notas si hay bloqueos
3. ⏱️ Actualizar tiempos reales vs estimados
4. 🚨 Escalar decisiones críticas
5. 🎯 Validar criterios de éxito antes de avanzar

### Estado actual:

- **Última actualización:** 2025-10-02 (Día 3 completado - Plan detallado definido)
- **Siguiente paso:** Día 5-6 - Migración de Configuración (Refactorización Studio)
- **Bloqueadores:** Ninguno
- **Decisión:** Saltar Día 4 (Gantt Templates seeds), ir directo a Iteración 1
- **Notas:**
  - ✅ Fase 0: 67% completada (3 de 4 días)
  - ✅ Schema V2.0 migrado
  - ✅ Seeds base (módulos, pipelines, usuarios)
  - ✅ Helpers de módulos implementados y testeados
  - 📖 Plan detallado de Iteración 1 documentado (13 días, 3 fases)
  - 🎯 Auditoría de estructura actual completada
  - 🎯 Arquitectura V2.0 definida (ver `ARQUITECTURA_STUDIO_V2.md`)

---

## 📌 PRÓXIMAS ITERACIONES (Referencia)

### Iteración 2: Admin (1.5 semanas)

- **Gestión de módulos platform**
  - CRUD de módulos (crear, editar, desactivar)
  - Asignación de módulos a planes
  - Configuración de precios y billing_type
- **Gestión de planes y suscripciones** ⭐ VALIDACIÓN COMPLETA
  - CRUD de planes (Basic, Pro, Enterprise)
  - Límites por plan (eventos/mes, storage, usuarios)
  - Módulos incluidos por plan
  - **Validación completa de planes:**
    - `checkStudioModuleWithPlan()` - Validar suscripción + plan + módulo
    - Verificar límites de uso (eventos, storage, etc.)
    - Bloqueo por suscripción vencida
    - Stripe integration para billing
- **Gestión de usuarios y roles**
  - CRUD de usuarios platform y studio
  - Asignación de roles y permisos
- **Pipelines globales (default stages)**
- **Analytics básicos**

### Iteración 3: Agente CRM (1 semana)

- Kanban Marketing (leads)
- Gestión de leads
- Cotizaciones
- Conversión lead → evento
- Dashboard agente

### Iteración 4: ZEN Magic (3 días)

- Chat con Claude
- Function calling a Server Actions
- Queries conversacionales
- Rate limiting

---

**Responsable:** Israel Wong  
**Status:** 🟢 Fase 0 - Día 1 completado  
**Próximo:** Día 2 - Migración de base de datos
