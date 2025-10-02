# 🌐 ANÁLISIS: ZEN Pages + Addons + Portal Clientes

**Fecha:** 2 de Octubre, 2025  
**Objetivo:** Definir arquitectura de Pages, ubicación de Addons y Portal de Clientes ANTES de refactorizar

---

## 📊 SITUACIÓN ACTUAL

### **Módulos Existentes (seeds):**

**CORE (incluidos en planes):**

- ✅ ZEN Manager (gestión operacional)
- ✅ ZEN Magic (IA - Pro+)
- ✅ ZEN Marketing (CRM - Pro+)

**ADDON (adicionales con precio):**

- ✅ ZEN Payment ($10/mes)
- ✅ ZEN Cloud ($15/mes)
- ✅ ZEN Conversations ($15/mes)
- ✅ ZEN Invitation ($12/mes)

### **❌ NO EXISTE:**

- Landing page pública del studio (`zen.pro/[slug]`)
- Sistema de portfolios/galerías públicas
- Lead forms públicos
- Portal de clientes
- Modelos de datos relacionados

---

## 🎯 PROPUESTA: ZEN PAGES (MÓDULO CORE NUEVO)

### **¿Por qué debe ser CORE?**

1. **Fundamental para negocio:** Todo studio necesita presencia online
2. **Diferenciador clave:** Landing page profesional incluida
3. **Canal de adquisición:** Lead form integrado con ZEN Marketing
4. **Evita dependencia externa:** No necesitan contratar página aparte
5. **Consistencia:** Toda la info del studio se usa para generar la page

### **URL Pública:**

```
zen.pro/[slug-studio]         → Landing page pública
zen.pro/[slug-studio]/paquetes → Catálogo público de paquetes
zen.pro/[slug-studio]/portal   → Portal de clientes (con auth)
```

### **Estructura de Landing Page:**

```
┌─────────────────────────────────────────────┐
│ NAVBAR                                       │
│ Logo | Home | Portafolio | Contacto         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ HEADER (2 columnas)                         │
│                                              │
│  [Logo Studio]    Nombre del Estudio        │
│                   Slogan                     │
│                   Descripción breve          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TABS SYSTEM                                  │
│                                              │
│ ┌─────┬─────────┬─────────┬────────┐       │
│ │ Home│Portfolio│ Contacto│ Portal │       │
│ └─────┴─────────┴─────────┴────────┘       │
│                                              │
│  [Contenido dinámico según tab activo]      │
│                                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FOOTER                                       │
│ Redes sociales | Teléfonos | Horarios       │
└─────────────────────────────────────────────┘
```

### **Tabs (Pestañas):**

#### **1. Tab: HOME**

- Hero section con imagen destacada
- Propuesta de valor
- CTA "Ver paquetes" / "Contáctanos"
- Resumen de servicios

#### **2. Tab: PORTAFOLIO**

- Portafolios apilados (vertical scroll)
- Cada portafolio:
  - Título (ej: "Bodas 2024")
  - Descripción
  - Galería de fotos (grid responsive)
  - Videos embebidos (YouTube/Vimeo)
  - CTA "Contrata ahora"

#### **3. Tab: CONTACTO**

- **Lead Form** (integrado con ZEN Marketing):
  - Tipo de evento (select según `studio_evento_tipos`)
  - Fecha del evento
  - Nombre
  - Correo
  - Teléfono
  - **Botón "Ver paquetes"**:
    - Guarda lead en DB
    - Aparece en CRM real-time
    - Redirige a: `zen.pro/[slug]/paquetes?lead_id=[id]`
- Información de contacto del studio
- Mapa de ubicación (Google Maps embed)

#### **4. Tab: PORTAL (clientes)**

- **Login para clientes** (email + código de acceso)
- Una vez autenticado:
  - Ver servicios contratados
  - Descargar contrato digital (PDF)
  - Estatus del servicio (timeline)
  - Balance pendiente
  - Historial de pagos
  - **Pasarela de pagos:**
    - Ficha de depósito directo (cuentas bancarias del studio)
    - Stripe Elements (si tiene ZEN Payment activo)

---

## 🗄️ MODELOS DE DATOS NECESARIOS

### **1. Landing Page del Studio**

```prisma
model studio_pages {
  id                String   @id @default(cuid())
  studio_id         String   @unique
  is_published      Boolean  @default(false)
  custom_domain     String?  @unique // futuro: studio.com
  meta_title        String?
  meta_description  String?
  meta_keywords     String?
  favicon_url       String?
  og_image_url      String?  // Open Graph
  analytics_code    String?  // Google Analytics
  custom_css        String?  // Personalización avanzada
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  studio            studios         @relation(fields: [studio_id], references: [id], onDelete: Cascade)
  sections          studio_page_sections[]
  portfolios        studio_portfolios[]

  @@index([studio_id, is_published])
}

model studio_page_sections {
  id              String   @id @default(cuid())
  page_id         String
  section_type    PageSectionType // HERO, ABOUT, CTA, etc.
  title           String?
  subtitle        String?
  content         String?  // JSON o markdown
  image_url       String?
  video_url       String?
  cta_text        String?
  cta_link        String?
  order           Int      @default(0)
  is_visible      Boolean  @default(true)
  settings        Json?    // Configuración específica de la sección
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  page            studio_pages @relation(fields: [page_id], references: [id], onDelete: Cascade)

  @@index([page_id, order])
}

enum PageSectionType {
  HERO
  ABOUT
  SERVICES
  CTA
  TESTIMONIALS
  FAQ
  CUSTOM
}
```

### **2. Portfolios y Galerías**

```prisma
model studio_portfolios {
  id              String   @id @default(cuid())
  page_id         String
  studio_id       String
  title           String
  slug            String   // URL-friendly
  description     String?
  cover_image_url String?
  category        String?  // "Bodas", "XV Años", "Empresarial"
  order           Int      @default(0)
  is_published    Boolean  @default(false)
  view_count      Int      @default(0)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  page            studio_pages            @relation(fields: [page_id], references: [id], onDelete: Cascade)
  studio          studios                 @relation(fields: [studio_id], references: [id], onDelete: Cascade)
  items           studio_portfolio_items[]

  @@unique([page_id, slug])
  @@index([studio_id, is_published])
  @@index([order])
}

model studio_portfolio_items {
  id              String   @id @default(cuid())
  portfolio_id    String
  item_type       PortfolioItemType // PHOTO, VIDEO
  title           String?
  description     String?
  image_url       String   // URL de la imagen (CDN)
  thumbnail_url   String?  // Thumbnail optimizado
  video_url       String?  // YouTube/Vimeo embed o directo
  video_provider  String?  // "youtube", "vimeo", "direct"
  order           Int      @default(0)
  width           Int?     // Para layout responsivo
  height          Int?
  file_size       Int?     // Bytes
  created_at      DateTime @default(now())

  portfolio       studio_portfolios @relation(fields: [portfolio_id], references: [id], onDelete: Cascade)

  @@index([portfolio_id, order])
}

enum PortfolioItemType {
  PHOTO
  VIDEO
}
```

### **3. Lead Forms Públicos (Integración con Marketing)**

```prisma
model studio_lead_forms {
  id                String   @id @default(cuid())
  studio_id         String
  form_name         String   // "Formulario de Contacto Principal"
  form_slug         String   // URL-friendly
  title             String?
  description       String?
  success_message   String   @default("¡Gracias! Nos pondremos en contacto pronto.")
  redirect_url      String?  // Redirigir después de envío
  fields_config     Json     // Configuración de campos (cuáles mostrar, requeridos, etc.)
  is_active         Boolean  @default(true)
  submit_count      Int      @default(0)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  studio            studios  @relation(fields: [studio_id], references: [id], onDelete: Cascade)

  @@unique([studio_id, form_slug])
  @@index([studio_id, is_active])
}

// Los leads capturados van a `marketing_leads` (ya existe en V2.0)
```

### **4. Portal de Clientes (Accesos)**

```prisma
model studio_client_portal_access {
  id                String   @id @default(cuid())
  studio_id         String
  event_id          String   // Relacionado con manager_events
  client_email      String
  access_code       String   @unique // Código de 6-8 dígitos para login
  is_active         Boolean  @default(true)
  last_accessed_at  DateTime?
  access_count      Int      @default(0)
  expires_at        DateTime?
  created_at        DateTime @default(now())

  studio            studios         @relation(fields: [studio_id], references: [id], onDelete: Cascade)
  event             manager_events  @relation(fields: [event_id], references: [id], onDelete: Cascade)

  @@unique([studio_id, event_id, client_email])
  @@index([access_code])
  @@index([client_email])
}
```

---

## 🏗️ UBICACIÓN EN SIDEBAR

### **Propuesta A: ZEN Pages como módulo separado (RECOMENDADO)**

```typescript
Dashboard (siempre)
├─ Vista General
└─ Notificaciones

─────────────────────

ZEN Manager (CORE)
├─ Kanban Operacional
├─ Eventos
├─ Agenda
└─ Finanzas

ZEN Marketing (CORE - Pro+)
├─ Kanban CRM
├─ Leads
├─ Cotizaciones
└─ Campañas

ZEN Pages (CORE - nuevo) ⭐
├─ Mi Landing Page
├─ Portafolios
├─ Lead Forms
└─ Portal de Clientes

ZEN Magic (CORE - Pro+)
└─ Asistente IA

─────────────────────

ADDONS (solo si activos):

ZEN Payment (ADDON)
└─ Procesamiento de Pagos

ZEN Cloud (ADDON)
├─ Galerías de Clientes
└─ Almacenamiento

ZEN Conversations (ADDON)
└─ Chat con Clientes

ZEN Invitation (ADDON)
└─ Invitaciones Digitales

─────────────────────

Configuración (siempre)
```

**✅ Ventajas:**

- Clara separación de responsabilidades
- ZEN Pages se enfoca solo en presencia online
- Escalable: fácil agregar más funcionalidades de marketing digital

**❌ Desventajas:**

- Un módulo más en el menú (pero es importante)

---

### **Propuesta B: Integrar Pages en ZEN Marketing**

```typescript
ZEN Marketing (CORE - Pro+)
├─ Kanban CRM
├─ Leads
├─ Cotizaciones
├─ Mi Página Web ⭐
│   ├─ Editor de Página
│   ├─ Portafolios
│   └─ Lead Forms
└─ Portal de Clientes ⭐
```

**✅ Ventajas:**

- Todo lo relacionado con "traer clientes" está junto
- Lead form → Leads → Cotización (flujo natural)

**❌ Desventajas:**

- ZEN Marketing puede volverse muy denso
- Mezcla herramientas internas (CRM) con presencia pública (Pages)
- Portal de Clientes no es "marketing", es "post-venta"

---

## 🎯 RECOMENDACIÓN FINAL

### **Estructura Propuesta:**

1. **ZEN Pages (Módulo CORE nuevo)**
   - Landing page pública
   - Portfolios y galerías
   - Lead forms (integrados con ZEN Marketing)
   - Configuración de página

2. **Portal de Clientes → Parte de ZEN Manager**
   - Es la extensión pública de un evento
   - Cliente ve su evento específico
   - Pagos relacionados con el evento (Manager)
   - **Ubicación:** `/manager/eventos/[id]/portal` (ruta pública)

3. **Addons en Sidebar:**
   - Solo aparecen si están activos
   - Siempre debajo de módulos CORE
   - Con indicador de "ADDON" o precio

---

## 📋 IMPACTO EN PLAN DE REFACTORIZACIÓN

### **Cambios necesarios:**

1. **Día 5-6: Migración de Configuración**
   - ✅ Agregar ZEN Pages en módulos (seed)
   - ✅ Configuración de página en `/configuracion/pages`
   - ✅ Sidebar muestra ZEN Pages si está activo

2. **Nuevo: Día 18-19: Implementación ZEN Pages (2 días)**
   - Crear modelos en Prisma
   - Migración de base de datos
   - Página básica de configuración
   - Preview de landing page
   - **Nota:** Implementación completa en Iteración posterior

3. **Portal de Clientes:**
   - Se implementa en Día 13-14 (junto con eventos)
   - Ruta pública: `/studio/[slug]/portal/[event-id]`
   - Login con email + access code

---

## ✅ DECISIONES CLAVE

1. **ZEN Pages = Módulo CORE** (incluido en todos los planes)
2. **Separado de Marketing** (módulo independiente)
3. **Portal de Clientes = Parte de Manager** (extensión pública del evento)
4. **Addons en Sidebar** (dinámicos, solo si activos)
5. **Implementación de Pages:** Estructura básica ahora, funcionalidad completa en Iteración 2

---

## 🚀 PRÓXIMOS PASOS

**ANTES de continuar con refactorización:**

1. ✅ Confirmar estructura de módulos con usuario
2. ✅ Agregar ZEN Pages a `modules-seed.ts`
3. ✅ Crear modelos en `schema.prisma`
4. ✅ Ejecutar migración
5. ✅ Actualizar PLAN_TRABAJO_V2.md con ajustes
6. ✅ Continuar con Día 5-6 (Migración de Configuración)

---

**¿Apruebas esta estructura o prefieres ajustes?**
