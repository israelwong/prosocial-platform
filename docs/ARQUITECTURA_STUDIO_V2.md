# 🏗️ ARQUITECTURA STUDIO V2.0 - Análisis y Refactorización

**Fecha:** 2 de Octubre, 2025  
**Objetivo:** Migrar Studio a arquitectura modular V2.0 con ZEN Design System

---

## 📊 AUDITORÍA DE ESTRUCTURA ACTUAL

### **Estructura Encontrada:**

```
src/app/studio/[slug]/
├── (main)/                    # Dashboard y herramientas principales
│   ├── dashboard/             # Vista general (hardcoded)
│   ├── kanban/                # Gestión de proyectos
│   ├── agenda/                # Calendario
│   ├── contactos/             # CRM básico
│   ├── finanzas/              # Pagos y facturación
│   └── layout.tsx             # ✅ Con ZEN Design System
│
└── configuracion/             # Sistema de configuración (funcional pre-V2)
    ├── estudio/               # Identidad, contacto, horarios, redes
    ├── negocio/               # Condiciones, cuentas, personal, precios
    ├── catalogo/              # Servicios, paquetes, tipos-evento
    ├── cuenta/                # Perfil, notificaciones, seguridad
    ├── integraciones/         # Integraciones externas
    └── layout.tsx             # ✅ Con ConfiguracionSidebarZen
```

### **Problemas Identificados:**

1. ❌ **No modular:** Dashboard tiene todo mezclado sin separación por módulos
2. ❌ **Configuración duplicada:** `tipos-evento` aparece en `catalogo/` y `negocio/`
3. ❌ **Sin validación de módulos:** No usa `checkStudioModule()`
4. ❌ **Schemas desactualizados:** Referencias a `projects` en lugar de `studios`
5. ❌ **Server Actions obsoletas:** Usan nombres de tablas antiguas
6. ⚠️ **Hardcoded:** Dashboard sin datos reales
7. ⚠️ **Sin responsive:** Desktop-first (pero esto es aceptable por ahora)

### **Elementos Positivos:**

1. ✅ **ZEN Design System:** Ya implementado en layouts
2. ✅ **Componentes Zen reusables:** En `/components/ui/zen`
3. ✅ **Estructura de configuración:** Lógica y completa
4. ✅ **Sidebar moderno:** Con `DashboardSidebarZen` y `ConfiguracionSidebarZen`

---

## 🎯 PROPUESTA ARQUITECTURA V2.0 MODULAR

### **Principio:** Separación por Módulos Activables

```
src/app/studio/[slug]/
├── layout.tsx                 # Layout principal (valida auth + studio existe)
├── page.tsx                   # Redirect a /dashboard o /configuracion
│
├── dashboard/                 # ✅ Dashboard general (SIEMPRE visible)
│   └── page.tsx              # Métricas cross-módulo
│
├── configuracion/             # ✅ Configuración CENTRALIZADA
│   ├── layout.tsx            # Con ConfiguracionSidebarZen
│   ├── page.tsx              # Vista general de setup
│   │
│   ├── estudio/              # Config base del studio
│   ├── cuenta/               # Config de usuario
│   ├── modulos/              # ⭐ NUEVO: Activar/desactivar módulos
│   └── [modulo]/             # Config específica por módulo
│       ├── manager/          # Config de ZEN Manager
│       ├── marketing/        # Config de ZEN Marketing
│       └── magic/            # Config de ZEN Magic
│
├── manager/                   # ⭐ MÓDULO: ZEN Manager (Operacional)
│   ├── layout.tsx            # Middleware: checkStudioModule('manager')
│   ├── page.tsx              # Redirect a /kanban
│   ├── kanban/               # Pipeline Manager
│   ├── eventos/              # Lista y detalle de eventos
│   │   └── [id]/
│   │       ├── page.tsx      # Vista del evento
│   │       ├── gantt/        # Timeline del evento
│   │       ├── tareas/       # Tareas del evento
│   │       └── finanzas/     # Pagos del evento
│   └── agenda/               # Calendario de eventos
│
├── marketing/                 # ⭐ MÓDULO: ZEN Marketing (CRM)
│   ├── layout.tsx            # Middleware: checkStudioModule('marketing')
│   ├── page.tsx              # Redirect a /kanban
│   ├── kanban/               # Pipeline Marketing
│   ├── leads/                # Gestión de leads
│   ├── cotizaciones/         # Cotizaciones
│   └── campanas/             # Campañas (futuro)
│
└── magic/                     # ⭐ MÓDULO: ZEN Magic (IA)
    ├── layout.tsx            # Middleware: checkStudioModule('magic')
    └── page.tsx              # Chat con Claude
```

---

## 🔑 DECISIONES ESTRATÉGICAS

### **1. Configuración: Centralizada + Secciones por Módulo**

**Decisión:** Híbrido inteligente

```
/configuracion/
├── Configuración BASE (necesaria para TODO el sistema):
│   ├── /estudio         → Identidad, contacto, horarios
│   ├── /cuenta          → Perfil personal, seguridad
│   └── /modulos         → Activar/desactivar módulos
│
└── Configuración por MÓDULO (solo si módulo activo):
    ├── /manager         → Tipos evento, personal, reglas agendamiento
    ├── /marketing       → Canales, etapas pipeline, plantillas
    └── /magic           → Configuración de IA, prompts
```

**Ventajas:**
- ✅ Setup inicial simple (solo config base)
- ✅ Configuración avanzada accesible sin salir de contexto
- ✅ Escalable: agregar módulo = agregar su config
- ✅ Validación: solo muestra config de módulos activos

**Sidebar de Configuración V2.0:**
```typescript
Configuración
├─ Estudio (siempre visible)
│  ├─ Identidad
│  ├─ Contacto
│  ├─ Horarios
│  └─ Redes Sociales
├─ Cuenta (siempre visible)
│  ├─ Perfil
│  ├─ Notificaciones
│  └─ Seguridad
├─ Módulos (siempre visible)
│  └─ Gestión de módulos activos
│
├─ ZEN Manager (si activo)
│  ├─ Tipos de Evento
│  ├─ Personal y Equipo
│  ├─ Reglas de Agendamiento
│  └─ Cuentas Bancarias
│
├─ ZEN Marketing (si activo)
│  ├─ Etapas de Pipeline
│  ├─ Canales de Adquisición
│  └─ Plantillas de Cotización
│
└─ ZEN Magic (si activo)
   └─ Configuración de IA
```

---

### **2. Sidebar Principal: Organizado por Módulos**

**Dashboard Sidebar V2.0:**

```typescript
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
├─ Cotizaciones
└─ Análisis

ZEN Magic (si activo)
└─ Asistente IA

─────────────────────

Configuración (siempre)
```

---

### **3. Middleware de Validación de Módulos**

Cada módulo tiene su layout con validación:

```typescript
// src/app/studio/[slug]/manager/layout.tsx
import { checkStudioModule } from '@/lib/modules';
import { redirect } from 'next/navigation';

export default async function ManagerLayout({
  params,
  children
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const { slug } = await params;
  
  // Obtener studio para validar
  const studio = await getStudioBySlug(slug);
  if (!studio) redirect('/404');
  
  // Validar módulo activo
  const hasManager = await checkStudioModule(studio.id, 'manager');
  if (!hasManager) {
    redirect(`/${slug}/configuracion/modulos?error=module_not_active`);
  }

  return (
    <div className="manager-module">
      {children}
    </div>
  );
}
```

---

## 📋 PLAN DE REFACTORIZACIÓN DETALLADO

### **FASE 1: FUNDAMENTOS (3-4 días)**

#### **Día 1-2: Migración de Configuración**

**Objetivo:** Reorganizar `/configuracion` con arquitectura modular

**Tareas:**

1. **Crear nueva estructura de carpetas** (2 horas)
   ```bash
   mkdir -p src/app/studio/[slug]/configuracion/modulos
   mkdir -p src/app/studio/[slug]/configuracion/manager
   mkdir -p src/app/studio/[slug]/configuracion/marketing
   mkdir -p src/app/studio/[slug]/configuracion/magic
   ```

2. **Migrar configuración base** (4 horas)
   - [ ] Mantener `/estudio` (actualizar queries)
   - [ ] Mantener `/cuenta` (actualizar queries)
   - [ ] Eliminar duplicados de tipos-evento

3. **Crear página de gestión de módulos** (4 horas)
   - [ ] `/configuracion/modulos/page.tsx`
   - [ ] Usar `getAllModulesWithStatus(studioId)`
   - [ ] Mostrar módulos CORE (activos)
   - [ ] Mostrar módulos ADDON (con precio, inactivos)
   - [ ] Placeholder "Activar" (Iteración 2)

4. **Refactorizar ConfiguracionSidebarZen** (2 horas)
   - [ ] Lógica dinámica con `getActiveModules()`
   - [ ] Mostrar secciones solo si módulo activo
   - [ ] Iconos por módulo

**Archivos a crear/modificar:**
```
src/app/studio/[slug]/configuracion/
├── modulos/
│   └── page.tsx (NUEVO)
├── manager/ (NUEVO)
│   ├── tipos-evento/
│   ├── personal/
│   ├── reglas-agendamiento/
│   └── cuentas-bancarias/
└── components/
    └── ConfiguracionSidebarZen.tsx (REFACTOR)
```

**Server Actions a actualizar:**
```typescript
// Todas las actions en /configuracion necesitan:
- Cambiar references de 'projects' a 'studios'
- Actualizar nombres de tablas (project_* → studio_*)
- Validar que studio_id sea correcto
```

---

#### **Día 3-4: Dashboard Global**

**Objetivo:** Dashboard cross-módulo con métricas reales

**Tareas:**

1. **Crear nuevo Dashboard** (4 horas)
   - [ ] `/dashboard/page.tsx` (nuevo, limpio)
   - [ ] Metrics cards con datos reales
   - [ ] Query eventos del mes
   - [ ] Query pagos pendientes
   - [ ] Query próximos eventos

2. **Refactorizar DashboardSidebarZen** (3 horas)
   - [ ] Lógica dinámica con `getActiveModules()`
   - [ ] Sección "Dashboard" siempre visible
   - [ ] Secciones por módulo solo si activo
   - [ ] Indicador de módulo actual

3. **Server Actions de Dashboard** (3 horas)
   - [ ] `getMonthMetrics(studioId)`
   - [ ] `getUpcomingEvents(studioId, days)`
   - [ ] `getPendingPayments(studioId)`

**Archivos:**
```
src/app/studio/[slug]/
├── dashboard/
│   └── page.tsx (NUEVO limpio)
└── (main)/
    └── components/
        └── DashboardSidebarZen.tsx (REFACTOR con módulos)
```

---

### **FASE 2: MÓDULO MANAGER (1 semana)**

**Seguir plan detallado de Iteración 1 del PLAN_TRABAJO_V2.md:**
- Día 5-6: Kanban Manager
- Día 7-8: Eventos y detalle
- Día 9-11: Sistema Gantt

---

### **FASE 3: LIMPIEZA Y OPTIMIZACIÓN (2-3 días)**

1. **Eliminar código legacy** (1 día)
   - [ ] Eliminar `/studio/[slug]/(main)/` antiguo
   - [ ] Consolidar componentes duplicados
   - [ ] Limpiar imports no usados

2. **Actualizar TODAS las Server Actions** (1 día)
   - [ ] Buscar todas las referencias a tablas `project_*`
   - [ ] Reemplazar por `studio_*`
   - [ ] Validar tipos con Prisma actualizado

3. **Testing y documentación** (1 día)
   - [ ] Smoke testing de toda la configuración
   - [ ] Actualizar README con nueva estructura
   - [ ] Documentar convenciones de módulos

---

## ✅ CHECKLIST DE VALIDACIÓN

**Antes de considerar refactorización completa:**

**Configuración:**
- [ ] Configuración base funciona (estudio, cuenta)
- [ ] Página de módulos muestra correctamente
- [ ] Sidebar dinámico muestra solo módulos activos
- [ ] No hay referencias a `projects` en queries
- [ ] Todas las Server Actions usan `studios`

**Dashboard:**
- [ ] Dashboard carga métricas reales
- [ ] Sidebar muestra solo módulos activos
- [ ] Navegación entre módulos funciona
- [ ] Middleware valida acceso a módulos

**Módulo Manager:**
- [ ] Kanban con pipeline Manager
- [ ] CRUD de eventos funcional
- [ ] Sistema Gantt básico
- [ ] Middleware protege rutas

---

## 🎯 PRIORIZACIÓN RECOMENDADA

**ORDEN LINEAL (Máxima eficiencia):**

```
1. Configuración Base (Día 1-2)
   ↓ (Esto desbloquea todo lo demás)
   
2. Dashboard Global (Día 3-4)
   ↓ (Estructura base funcional)
   
3. Módulo Manager - Kanban (Día 5-6)
   ↓ (Feature más crítica)
   
4. Módulo Manager - Eventos (Día 7-8)
   ↓ (Completar gestión operacional)
   
5. Módulo Manager - Gantt (Día 9-11)
   ↓ (Diferenciador clave)
   
6. Limpieza y Optimización (Día 12-13)
   ↓ (Código limpio y mantenible)
   
7. Responsive y Polish (Iteración posterior)
```

---

## 🚀 MÉTRICAS DE ÉXITO

**Al finalizar refactorización:**

**Técnicas:**
- ✅ 0 referencias a `projects` en código
- ✅ 100% de tablas usan nomenclatura `studio_*`
- ✅ Todas las rutas protegidas con validación de módulos
- ✅ Sidebar dinámico basado en módulos activos
- ✅ Configuración modular y escalable

**Funcionales:**
- ✅ Usuario puede configurar studio completamente
- ✅ Dashboard muestra métricas reales
- ✅ Módulo Manager funciona end-to-end
- ✅ Navegación intuitiva y rápida

**UX:**
- ✅ Simplicidad: Configuración en un solo lugar
- ✅ Velocidad: Carga < 2 segundos
- ✅ Robustez: Sin errores en consola
- ✅ Claridad: Usuario entiende qué módulos tiene activos

---

**Próximo paso:** Confirmar estrategia y comenzar Día 1-2 (Migración de Configuración)

