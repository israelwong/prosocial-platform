# 🎯 DECISIONES ARQUITECTÓNICAS V2.0

**Fecha:** 2 de Octubre, 2025  
**Branch:** `v2-foundation`  
**Estado:** En ejecución

---

## 📋 DECISIONES CRÍTICAS APROBADAS

### 1. **Naming Convention Final**

✅ **ADOPTADO: snake_case para TODO**

```prisma
// ✅ ESTÁNDAR V2.0
model studios {                    // snake_case para tablas
  id String @id
  studio_name String              // snake_case para columnas
  created_at DateTime             // snake_case para columnas
  is_active Boolean               // snake_case para columnas
}
```

**Justificación:**
- Consistencia total (tablas + columnas)
- Estándar PostgreSQL nativo
- Queries SQL más legibles
- Evita conversión mental

**Impacto:**
- ❌ NO crear tablas con prefijo `_v2`
- ✅ Renombrar columnas existentes
- ✅ Data es de prueba, no hay riesgo

---

### 2. **Renombrado Core: projects → studios**

✅ **APROBADO: Cambio en TODA la base de datos**

```prisma
// ❌ ANTES
model projects {
  id String
  name String
  planId String
}

// ✅ DESPUÉS
model studios {
  id String
  studio_name String
  plan_id String
}
```

**Razón:**
- Congruencia con scope del negocio
- Mejor comprensión semántica
- Alineado con dominio (studio fotográfico)

---

### 3. **Estrategia de Migración**

✅ **APROBADO: Migración agresiva (data de prueba)**

**Contexto:**
- Toda la data actual es de prueba
- No hay información real de clientes
- Podemos hacer cambios radicales sin rollback complejo

**Estrategia:**
1. Renombrar tablas y columnas directamente
2. Aplicar migración en un solo paso
3. Validar con Prisma generate
4. Seed con data de prueba limpia

---

### 4. **Priorización de Desarrollo**

✅ **ORDEN ESTRATÉGICO APROBADO**

```
ITERACIÓN 1: STUDIO (2 semanas)
    ↓
ITERACIÓN 2: ADMIN (1.5 semanas)
    ↓
ITERACIÓN 3: AGENTE (1 semana)
    ↓
ITERACIÓN 4: ZEN MAGIC (3 días)
```

**Razón:**
- Studio = Core business (fotógrafos usándolo diario)
- Admin = Gestión de plataforma (menos crítico para MVP)
- Agente = Ventas/soporte (puede esperar)
- IA = Diferenciador, pero no bloqueante

---

### 5. **Reglas de Desarrollo Estrictas**

#### **5.1 Solo ZEN Design System**

```typescript
// ✅ OBLIGATORIO
import { ZenButton, ZenInput, ZenCard } from "@/components/ui/zen";

// ❌ PROHIBIDO durante iteraciones 1-4
import { Button } from "@/components/ui/shadcn/button";
```

#### **5.2 No Refactorizar a Medias**

```markdown
❌ NO hacer: "Este componente podría ser mejor..."
❌ NO hacer: "Voy a optimizar este query primero..."
✅ SÍ hacer: Terminar funcionalidad completa → LUEGO mejorar
```

#### **5.3 Server Actions en Studio**

```typescript
// ✅ Studio (nuevo código)
"use server";
export async function crearEvento(data: EventoInput) { ... }

// ⚠️ Admin (mantener API routes por ahora)
// Migrar en iteración posterior
```

---

### 6. **Arquitectura de Base de Datos V2**

#### **6.1 Sistema de Módulos (NUEVO)**

```prisma
model platform_modules {
  id String @id @default(cuid())
  slug String @unique  // "manager", "magic", "marketing"
  name String
  category ModuleCategory  // CORE, ADDON
  base_price Decimal?
}

model studio_modules {
  id String @id @default(cuid())
  studio_id String
  module_id String
  is_active Boolean @default(false)
  
  @@unique([studio_id, module_id])
}
```

#### **6.2 Usuarios Multi-Contexto (NUEVO)**

```prisma
model users {
  id String @id @default(cuid())
  supabase_id String @unique
  email String @unique
  full_name String?
  
  platform_roles user_platform_roles[]
  studio_roles user_studio_roles[]
}

model user_platform_roles {
  user_id String
  role PlatformRole  // SUPER_ADMIN, AGENTE, SUSCRIPTOR
}

model user_studio_roles {
  user_id String
  studio_id String
  role StudioRole  // OWNER, PHOTOGRAPHER, CLIENT, etc.
  permissions Json?
}
```

#### **6.3 Pipelines Duales (NUEVO)**

```prisma
// CRM Pre-Venta
model marketing_pipeline_stages { ... }
model marketing_leads { ... }

// Operacional Post-Venta
model manager_pipeline_stages { ... }
model manager_events {  // Extender project_eventos
  originated_from_lead_id String? @unique
  stage_id String
  contract_value Decimal
  gantt gantt_event_instances?
}
```

#### **6.4 Gantt Templates (NUEVO)**

```prisma
model gantt_templates {
  studio_id String
  name String  // "Boda Standard"
  estimated_duration_days Int
  tasks gantt_template_tasks[]
}

model gantt_event_instances {
  event_id String @unique
  template_id String?
  tasks gantt_event_tasks[]
}
```

---

## 📊 FASE 0: FUNDAMENTOS (3-4 días)

### **Día 1: Limpieza Base de Datos** ✅ COMPLETADO
- [x] Crear ramas: backup-pre-v2, v2-foundation
- [x] Renombrar projects → studios
- [x] Aplicar snake_case a TODAS las columnas
- [x] Crear modelos V2.0 (módulos, usuarios, pipelines, gantt)
- [x] Validar schema 100%
- [x] Commit inicial
- [ ] Aplicar migración → SIGUIENTE PASO

### **Día 2: Sistema de Módulos**
- [ ] Crear platform_modules, studio_modules
- [ ] Seed módulos MVP
- [ ] Helper checkStudioModule()

### **Día 3: Usuarios Multi-Contexto**
- [ ] Crear users, user_platform_roles, user_studio_roles
- [ ] Seed usuarios de prueba
- [ ] Migrar usuarios existentes

### **Día 4: Pipelines + Gantt**
- [ ] Crear marketing_leads, marketing_pipeline_stages
- [ ] Extender project_eventos → manager_events
- [ ] Crear gantt_templates, gantt_event_instances
- [ ] Seed stages + templates básicos

---

## ✅ CHECKLIST DE VALIDACIÓN

### **Post-Migración (Día 1)**
- [ ] `npx prisma generate` sin errores
- [ ] `npx prisma migrate dev` exitoso
- [ ] Queries básicas funcionan
- [ ] Seed exitoso

### **Post-Módulos (Día 2)**
- [ ] checkStudioModule() funciona
- [ ] Módulos activados en studios de prueba
- [ ] Gates de features funcionan

### **Post-Usuarios (Día 3)**
- [ ] Login con Supabase funciona
- [ ] Roles se asignan correctamente
- [ ] Permisos se verifican

### **Post-Pipelines (Día 4)**
- [ ] Kanban Marketing funciona
- [ ] Kanban Manager funciona
- [ ] Gantt templates se aplican

---

## 🚨 REGLAS DE ORO

1. ✅ **NO refactorizar hasta terminar iteración**
2. ✅ **Solo ZEN Design System**
3. ✅ **Server Actions en Studio (nuevo código)**
4. ✅ **Testing mínimo pero crítico**
5. ✅ **Documentar decisiones importantes**

---

## 📝 NOTAS ADICIONALES

- Data actual = prueba (cambios agresivos OK)
- Admin con API routes OK por ahora
- Migrar a Server Actions en iteración futura
- Foco en velocidad de desarrollo

---

**Última actualización:** 2025-10-02  
**Responsable:** Israel Wong  
**Status:** ✅ En ejecución

