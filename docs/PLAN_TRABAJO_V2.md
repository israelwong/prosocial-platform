# 📋 PLAN DE TRABAJO V2.0 - Tracking Detallado

**Branch:** `v2-foundation`  
**Inicio:** 2 de Octubre, 2025  
**Meta:** MVP Studio funcional en 2 semanas

---

## 🎯 RESUMEN EJECUTIVO

| Fase | Duración | Estado | Completado |
|------|----------|--------|------------|
| **Fase 0: Fundamentos** | 3-4 días | 🟢 En progreso | 25% (1/4 días) |
| **Iteración 1: Studio MVP** | 2 semanas | ⚪ Pendiente | 0% |
| **Iteración 2: Admin** | 1.5 semanas | ⚪ Pendiente | 0% |
| **Iteración 3: Agente CRM** | 1 semana | ⚪ Pendiente | 0% |
| **Iteración 4: ZEN Magic** | 3 días | ⚪ Pendiente | 0% |

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

### **📅 Día 2: Migración + Seeds Base** 🔵 SIGUIENTE

#### Aplicar Migración
- [ ] Respaldar base de datos actual (aunque es data de prueba)
- [ ] `npx prisma migrate dev --name v2_architecture_complete`
- [ ] `npx prisma generate` (generar cliente TypeScript)
- [ ] Verificar que no hay errores de migración

#### Seed: Módulos Platform
```typescript
// prisma/seeds/modules-seed.ts
- [ ] Crear seed de platform_modules:
  - [ ] ZEN Manager (CORE, incluido en todos)
  - [ ] ZEN Magic (CORE, planes Pro+)
  - [ ] ZEN Marketing (CORE, planes Pro+)
  - [ ] ZEN Payment (ADDON, +$10 USD/mes)
  - [ ] ZEN Cloud (ADDON, +$15 USD/mes)
  - [ ] ZEN Conversations (ADDON, +$15 USD/mes)
  - [ ] ZEN Invitation (ADDON, +$12 USD/mes)
```

#### Seed: Usuarios de Prueba
```typescript
// prisma/seeds/users-seed.ts
- [ ] Crear usuarios base:
  - [ ] Super Admin (platform_role: SUPER_ADMIN)
  - [ ] Agente de prueba (platform_role: AGENTE)
  - [ ] Studio Owner de prueba (platform_role: SUSCRIPTOR)
```

#### Activar Módulos en Studios
```typescript
// prisma/seeds/studio-modules-seed.ts
- [ ] Activar módulos core en studio de prueba:
  - [ ] ZEN Manager → is_active: true
  - [ ] ZEN Magic → is_active: true (si plan Pro+)
  - [ ] ZEN Marketing → is_active: true (si plan Pro+)
```

#### Helper Functions
```typescript
// src/lib/modules/check-module.ts
- [ ] Crear helper `checkStudioModule(studioId, moduleSlug)`
- [ ] Crear helper `getStudioModules(studioId)`
- [ ] Crear helper `activateModule(studioId, moduleSlug, config?)`
- [ ] Testing básico de helpers
```

**Criterio de Éxito:**
- ✅ Migración sin errores
- ✅ Base de datos con modelos V2.0
- ✅ Módulos creados y activados
- ✅ Helpers funcionando

**Tiempo estimado:** 4-6 horas

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

## 🔷 ITERACIÓN 1: STUDIO MVP (2 semanas)

**Objetivo:** Módulo ZEN Manager completamente funcional para fotógrafos

### **📅 Semana 1: Layout + Manager Kanban**

#### Día 5-6: Layout Base con ZEN Design System
```typescript
// src/app/studio/[slug]/layout.tsx
- [ ] Crear layout base con sidebar
- [ ] ZenSidebar con navegación por módulos
- [ ] ZenNavbar con user dropdown
- [ ] Verificar módulos activos del studio
- [ ] Ocultar módulos no activos
- [ ] Responsive mobile-first
```

#### Día 7-8: Dashboard Studio
```typescript
// src/app/studio/[slug]/page.tsx
- [ ] Métricas básicas (ZenCard)
  - [ ] Eventos este mes
  - [ ] Pendientes de pago
  - [ ] Próximos eventos (7 días)
- [ ] Lista próximos eventos (ZenTable)
- [ ] Gráfico simple de ingresos (opcional)
```

#### Día 9-11: Kanban Manager (Pipeline Operacional)
```typescript
// src/app/studio/[slug]/manager/kanban/page.tsx
- [ ] Vista Kanban con columnas por stage
- [ ] Drag & drop eventos entre stages
- [ ] Modal crear evento (ZenModal + ZenForm)
- [ ] Modal editar evento
- [ ] Filtros: fecha, tipo evento, cliente
- [ ] Server Actions:
  - [ ] crearEvento(data)
  - [ ] actualizarEvento(id, data)
  - [ ] moverEtapa(eventoId, nuevaEtapaId)
  - [ ] eliminarEvento(id)
```

**Componentes ZEN a crear:**
- [ ] EventoCard (muestra info del evento en kanban)
- [ ] EventoModal (formulario crear/editar)
- [ ] StageColumn (columna del kanban)
- [ ] EventoFilters (filtros de búsqueda)

---

### **📅 Semana 2: Gantt + Agenda**

#### Día 12-14: Sistema Gantt Templates
```typescript
// src/app/studio/[slug]/manager/evento/[id]/gantt/page.tsx
- [ ] Vista timeline del evento
- [ ] Selector de template (si no tiene)
- [ ] Lista de tareas con fechas
- [ ] Editar tarea (modal)
- [ ] Asignar personal a tarea
- [ ] Marcar tarea completada
- [ ] Indicadores de progreso (%)
- [ ] Alertas de tareas atrasadas

// src/app/studio/[slug]/configuracion/gantt-templates/page.tsx
- [ ] Lista templates del studio
- [ ] Crear template nuevo
- [ ] Editar template existente
- [ ] Agregar/quitar tareas del template
- [ ] Preview del template
```

**Server Actions:**
```typescript
- [ ] aplicarTemplate(eventoId, templateId)
- [ ] crearTemplate(studioId, data)
- [ ] actualizarTarea(tareaId, data)
- [ ] completarTarea(tareaId, userId)
```

#### Día 15-16: Agenda de Eventos
```typescript
// src/app/studio/[slug]/manager/agenda/page.tsx
- [ ] Calendario mensual (ZenCalendar o custom)
- [ ] Vista lista con filtros
- [ ] Códigos de color por tipo evento
- [ ] Click evento → Modal detalle
- [ ] Integración Google Calendar (básica)
```

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
- **Última actualización:** 2025-10-02 (Día 1 completado)
- **Siguiente paso:** Día 2 - Migración + Seeds
- **Bloqueadores:** Ninguno
- **Notas:** Schema V2.0 validado 100%, listo para migración

---

## 📌 PRÓXIMAS ITERACIONES (Referencia)

### Iteración 2: Admin (1.5 semanas)
- Gestión de módulos platform
- Gestión de usuarios y roles
- Pipelines globales (default stages)
- Analytics básicos

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

