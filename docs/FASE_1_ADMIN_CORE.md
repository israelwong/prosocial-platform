# 🚀 FASE 1: FUNDACIÓN Y ADMIN CORE

## Plan Detallado de Implementación

---

## 🎯 **OBJETIVO DE LA FASE**

Implementar las funcionalidades core del panel de administración que permitan:

- Gestión completa de agentes comerciales
- Sistema de suscripciones con Stripe
- Gestión básica de leads con Kanban
- Administración de estudios (tenants)
- Dashboard con métricas clave

---

## 📋 **TAREAS DETALLADAS**

### **1.1 CONFIGURACIÓN DE STRIPE** ⏱️ 2-3 días

#### **1.1.1 Configuración Inicial**

- [ ] **Crear cuenta Stripe** (si no existe)
- [ ] **Configurar productos y precios**
  - [ ] Plan Básico: $29.99/mes
  - [ ] Plan Pro: $59.99/mes
  - [ ] Plan Enterprise: $99.99/mes
- [ ] **Configurar webhooks**
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`

#### **1.1.2 Implementación Técnica**

- [ ] **Instalar dependencias**
  ```bash
  npm install stripe @stripe/stripe-js
  ```
- [ ] **Configurar variables de entorno**
  ```env
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] **Crear cliente Stripe**

  ```typescript
  // lib/stripe.ts
  import Stripe from "stripe";

  export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });
  ```

#### **1.1.3 Webhooks Handler**

- [ ] **Crear API route para webhooks**
  ```typescript
  // app/api/webhooks/stripe/route.ts
  export async function POST(request: Request) {
    // Verificar webhook signature
    // Procesar eventos de Stripe
    // Actualizar base de datos
  }
  ```

---

### **1.2 MODELO DE BASE DE DATOS** ⏱️ 1-2 días

#### **1.2.1 Actualizar Schema de Prisma**

- [ ] **Agregar tabla `plans`**

  ```prisma
  model Plan {
    id                String   @id @default(cuid())
    name              String
    description       String?
    stripe_price_id   String   @unique
    price_monthly     Decimal
    price_yearly      Decimal?
    features          Json
    limits            Json
    is_active         Boolean  @default(true)
    created_at        DateTime @default(now())
    updated_at        DateTime @updatedAt

    subscriptions     Subscription[]
  }
  ```

- [ ] **Agregar tabla `subscriptions`**

  ```prisma
  model Subscription {
    id                      String   @id @default(cuid())
    studio_id               String
    stripe_subscription_id  String   @unique
    stripe_customer_id      String
    plan_id                 String
    status                  String
    current_period_start    DateTime
    current_period_end      DateTime
    billing_cycle_anchor    DateTime
    created_at              DateTime @default(now())
    updated_at              DateTime @updatedAt

    studio                  Studio   @relation(fields: [studio_id], references: [id])
    plan                    Plan     @relation(fields: [plan_id], references: [id])
  }
  ```

- [ ] **Agregar tabla `billing_cycles`**
  ```prisma
  model BillingCycle {
    id                String   @id @default(cuid())
    subscription_id   String
    period_start      DateTime
    period_end        DateTime
    amount            Decimal
    status            String
    stripe_invoice_id String?
    created_at        DateTime @default(now())

    subscription      Subscription @relation(fields: [subscription_id], references: [id])
  }
  ```

#### **1.2.2 Migración de Base de Datos**

- [ ] **Generar migración**
  ```bash
  npx prisma migrate dev --name add_subscriptions
  ```
- [ ] **Aplicar migración**
  ```bash
  npx prisma db push
  ```

---

### **1.3 GESTIÓN DE AGENTES** ⏱️ 3-4 días

#### **1.3.1 CRUD de Agentes**

- [ ] **Crear página de agentes**

  ```typescript
  // app/admin/agents/page.tsx
  export default function AgentsPage() {
    // Lista de agentes con filtros
    // Botón para crear nuevo agente
    // Acciones: editar, eliminar, activar/desactivar
  }
  ```

- [ ] **Formulario de creación/edición**

  ```typescript
  // components/admin/AgentForm.tsx
  interface AgentFormData {
    name: string;
    email: string;
    phone?: string;
    role: "agent" | "senior_agent" | "manager";
    is_active: boolean;
  }
  ```

- [ ] **Server Actions para CRUD**
  ```typescript
  // lib/actions/agents.ts
  export async function createAgent(data: AgentFormData) {
    // Validar datos
    // Crear agente en base de datos
    // Retornar resultado
  }
  ```

#### **1.3.2 Asignación de Leads**

- [ ] **Sistema de asignación automática**
  - [ ] Round-robin entre agentes activos
  - [ ] Asignación por especialización
  - [ ] Reasignación manual

- [ ] **Interfaz de asignación**
  ```typescript
  // components/admin/LeadAssignment.tsx
  export function LeadAssignment({ leadId, currentAgent, availableAgents }) {
    // Dropdown para seleccionar agente
    // Botón para reasignar
    // Historial de asignaciones
  }
  ```

#### **1.3.3 Estadísticas por Agente**

- [ ] **Métricas individuales**
  - [ ] Leads asignados
  - [ ] Conversiones
  - [ ] Tiempo promedio de respuesta
  - [ ] Ingresos generados

- [ ] **Dashboard del agente**
  ```typescript
  // app/asesor/dashboard/page.tsx
  export default function AgentDashboard() {
    // Métricas personales
    // Leads asignados
    // Tareas pendientes
  }
  ```

---

### **1.4 GESTIÓN DE PLANES** ⏱️ 2-3 días

#### **1.4.1 CRUD de Planes**

- [ ] **Página de gestión de planes**

  ```typescript
  // app/admin/plans/page.tsx
  export default function PlansPage() {
    // Lista de planes con precios
    // Botón para crear/editar plan
    // Activar/desactivar planes
  }
  ```

- [ ] **Formulario de plan**
  ```typescript
  // components/admin/PlanForm.tsx
  interface PlanFormData {
    name: string;
    description: string;
    price_monthly: number;
    price_yearly?: number;
    features: string[];
    limits: {
      events_per_month?: number;
      storage_gb?: number;
      users?: number;
    };
  }
  ```

#### **1.4.2 Sincronización con Stripe**

- [ ] **Crear productos en Stripe**
  ```typescript
  // lib/stripe/products.ts
  export async function createStripeProduct(plan: PlanFormData) {
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price_monthly * 100,
      currency: "usd",
      recurring: { interval: "month" },
    });

    return { product, price };
  }
  ```

---

### **1.5 GESTIÓN DE LEADS BÁSICA** ⏱️ 4-5 días

#### **1.5.1 CRUD de Leads**

- [ ] **Página de leads**

  ```typescript
  // app/admin/leads/page.tsx
  export default function LeadsPage() {
    // Lista de leads con filtros
    // Búsqueda por nombre, email, teléfono
    // Filtros por estado, agente, fuente
  }
  ```

- [ ] **Formulario de lead**
  ```typescript
  // components/admin/LeadForm.tsx
  interface LeadFormData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source: "website" | "referral" | "ads" | "manual";
    status: "new" | "contacted" | "qualified" | "proposal" | "closed";
    assigned_agent_id?: string;
    notes?: string;
  }
  ```

#### **1.5.2 Kanban de Leads**

- [ ] **Implementar DND Kit**

  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```

- [ ] **Componente Kanban**
  ```typescript
  // components/admin/LeadsKanban.tsx
  export function LeadsKanban({ leads, onLeadMove }) {
    const columns = [
      {
        id: "new",
        title: "Nuevo",
        leads: leads.filter((l) => l.status === "new"),
      },
      {
        id: "contacted",
        title: "Contactado",
        leads: leads.filter((l) => l.status === "contacted"),
      },
      {
        id: "qualified",
        title: "Calificado",
        leads: leads.filter((l) => l.status === "qualified"),
      },
      {
        id: "proposal",
        title: "Propuesta",
        leads: leads.filter((l) => l.status === "proposal"),
      },
      {
        id: "closed",
        title: "Cerrado",
        leads: leads.filter((l) => l.status === "closed"),
      },
    ];

    // Implementar drag & drop
    // Actualizar estado en base de datos
  }
  ```

#### **1.5.3 Filtros y Búsqueda**

- [ ] **Filtros avanzados**
  - [ ] Por agente asignado
  - [ ] Por estado
  - [ ] Por fuente
  - [ ] Por fecha de creación
  - [ ] Por rango de ingresos potenciales

- [ ] **Búsqueda en tiempo real**
  ```typescript
  // hooks/useLeadSearch.ts
  export function useLeadSearch(query: string) {
    // Debounced search
    // Filtrado por múltiples campos
    // Resultados paginados
  }
  ```

---

### **1.6 GESTIÓN DE ESTUDIOS (TENANTS)** ⏱️ 3-4 días

#### **1.6.1 CRUD de Estudios**

- [ ] **Página de estudios**

  ```typescript
  // app/admin/studios/page.tsx
  export default function StudiosPage() {
    // Lista de estudios con suscripciones
    // Filtros por estado, plan, fecha
    // Acciones: editar, activar/desactivar
  }
  ```

- [ ] **Formulario de estudio**
  ```typescript
  // components/admin/StudioForm.tsx
  interface StudioFormData {
    name: string;
    slug: string;
    description?: string;
    email: string;
    phone?: string;
    address?: string;
    plan_id: string;
    is_active: boolean;
  }
  ```

#### **1.6.2 Gestión de Suscripciones**

- [ ] **Activar/desactivar suscripciones**

  ```typescript
  // lib/actions/subscriptions.ts
  export async function toggleSubscription(
    studioId: string,
    isActive: boolean
  ) {
    if (isActive) {
      // Activar suscripción en Stripe
      // Actualizar estado en base de datos
    } else {
      // Cancelar suscripción en Stripe
      // Actualizar estado en base de datos
    }
  }
  ```

- [ ] **Cambio de planes**
  ```typescript
  // lib/actions/subscriptions.ts
  export async function changePlan(studioId: string, newPlanId: string) {
    // Obtener suscripción actual
    // Cambiar plan en Stripe
    // Aplicar prorrateo
    // Actualizar base de datos
  }
  ```

#### **1.6.3 Historial de Cambios**

- [ ] **Auditoría de suscripciones**
  ```typescript
  // components/admin/SubscriptionHistory.tsx
  export function SubscriptionHistory({ studioId }) {
    // Lista de cambios de suscripción
    // Fechas de activación/desactivación
    // Cambios de plan
    // Pagos realizados
  }
  ```

---

### **1.7 DASHBOARD PRINCIPAL** ⏱️ 3-4 días

#### **1.7.1 Métricas Clave**

- [ ] **Resumen de leads**
  - [ ] Total de leads del mes
  - [ ] Leads por estado
  - [ ] Conversión por etapa
  - [ ] Tiempo promedio de conversión

- [ ] **Estadísticas de agentes**
  - [ ] Leads asignados por agente
  - [ ] Conversiones por agente
  - [ ] Performance individual
  - [ ] Ranking de agentes

- [ ] **Métricas financieras**
  - [ ] Total vendido del mes
  - [ ] Ingresos recurrentes (MRR)
  - [ ] Churn rate
  - [ ] Customer Lifetime Value

#### **1.7.2 Gráficas con Recharts**

- [ ] **Gráfica de leads por etapa**

  ```typescript
  // components/admin/charts/LeadsByStageChart.tsx
  export function LeadsByStageChart({ data }) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  ```

- [ ] **Gráfica de ingresos mensuales**
  ```typescript
  // components/admin/charts/RevenueChart.tsx
  export function RevenueChart({ data }) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  ```

#### **1.7.3 Widgets de Dashboard**

- [ ] **Widget de leads recientes**

  ```typescript
  // components/admin/widgets/RecentLeadsWidget.tsx
  export function RecentLeadsWidget() {
    // Lista de últimos 5 leads
    // Estado y agente asignado
    // Enlace a detalles
  }
  ```

- [ ] **Widget de alertas**
  ```typescript
  // components/admin/widgets/AlertsWidget.tsx
  export function AlertsWidget() {
    // Pagos fallidos
    // Suscripciones próximas a vencer
    // Leads sin seguimiento
  }
  ```

---

## 🧪 **TESTING Y VALIDACIÓN**

### **1.8 Testing de Funcionalidades**

- [ ] **Testing de CRUD de agentes**
  - [ ] Crear agente
  - [ ] Editar agente
  - [ ] Eliminar agente
  - [ ] Validaciones de formulario

- [ ] **Testing de gestión de leads**
  - [ ] Crear lead
  - [ ] Mover lead en Kanban
  - [ ] Asignar lead a agente
  - [ ] Filtros y búsqueda

- [ ] **Testing de suscripciones**
  - [ ] Crear suscripción
  - [ ] Cambiar plan
  - [ ] Activar/desactivar
  - [ ] Webhooks de Stripe

### **1.9 Validación de UX**

- [ ] **Flujo de administración**
  - [ ] Navegación intuitiva
  - [ ] Acciones claras
  - [ ] Feedback visual
  - [ ] Manejo de errores

- [ ] **Performance**
  - [ ] Tiempo de carga < 2 segundos
  - [ ] Responsive design
  - [ ] Accesibilidad básica

---

## 📊 **CRITERIOS DE ACEPTACIÓN**

### **Funcionalidades Core:**

- [ ] Admin puede crear/editar/eliminar agentes
- [ ] Admin puede gestionar planes de suscripción
- [ ] Admin puede activar/desactivar suscripciones manualmente
- [ ] Sistema de leads básico funcionando
- [ ] Kanban de leads operativo
- [ ] Dashboard con métricas clave

### **Calidad Técnica:**

- [ ] Código bien documentado
- [ ] Manejo de errores robusto
- [ ] Validaciones de formulario
- [ ] Testing básico implementado

### **Experiencia de Usuario:**

- [ ] Interfaz intuitiva y profesional
- [ ] Navegación fluida
- [ ] Feedback visual claro
- [ ] Responsive design

---

## 🚀 **ENTREGABLES DE LA FASE 1**

1. **Sistema de suscripciones** con Stripe integrado
2. **Panel de administración** completamente funcional
3. **Gestión de agentes** con CRUD completo
4. **Sistema de leads** con Kanban drag & drop
5. **Dashboard** con métricas y gráficas
6. **Gestión de estudios** y suscripciones
7. **Documentación** de APIs y componentes

---

## ⏱️ **CRONOGRAMA ESTIMADO**

| Tarea                | Duración | Dependencias         |
| -------------------- | -------- | -------------------- |
| Configuración Stripe | 2-3 días | -                    |
| Modelo de BD         | 1-2 días | Stripe config        |
| Gestión Agentes      | 3-4 días | Modelo BD            |
| Gestión Planes       | 2-3 días | Stripe config        |
| Gestión Leads        | 4-5 días | Modelo BD            |
| Gestión Estudios     | 3-4 días | Modelo BD            |
| Dashboard            | 3-4 días | Todas las anteriores |
| Testing              | 2-3 días | Todas las anteriores |

**Total Estimado: 20-28 días (4-6 semanas)**

---

**Fecha de Creación:** $(date)
**Última Actualización:** $(date)
**Responsable:** Equipo de Desarrollo ProSocial Platform
