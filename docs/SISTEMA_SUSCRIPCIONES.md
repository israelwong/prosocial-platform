# 💳 SISTEMA DE SUSCRIPCIONES Y TEMPORALIDAD DE COBRO

## Análisis y Recomendaciones para ProSocial Platform

---

## 🎯 **OBJETIVO**

Definir la estrategia óptima para el sistema de suscripciones y temporalidad de cobro que permita:

- Flujo de caja predecible
- Experiencia de usuario simple
- Implementación técnica eficiente
- Escalabilidad del negocio

---

## 📊 **ANÁLISIS DE OPCIONES**

### **1. COBRO EN FECHA DE SUSCRIPCIÓN** ⭐ **RECOMENDADO**

#### **✅ Ventajas:**

- **Simplicidad Técnica:** Fácil implementación con Stripe
- **Flujo de Caja Predecible:** Cada cliente tiene su ciclo fijo
- **Experiencia de Usuario:** Claro y comprensible
- **Escalabilidad:** No requiere lógica compleja de agrupación
- **Flexibilidad:** Permite diferentes ciclos de facturación

#### **❌ Desventajas:**

- **Reportes Mensuales:** Requieren agregación por período
- **Distribución de Cobros:** No concentrados en fechas específicas

#### **🔧 Implementación Técnica:**

```typescript
// Stripe Subscription con billing_cycle_anchor
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  billing_cycle_anchor: Math.floor(Date.now() / 1000), // Fecha actual
  proration_behavior: "create_prorations", // Prorrateo automático
});
```

---

### **2. COBRO AGRUPADO (FIN DE MES)**

#### **✅ Ventajas:**

- **Reportes Claros:** Fácil análisis mensual
- **Flujo de Caja Concentrado:** Ingresos predecibles

#### **❌ Desventajas:**

- **Complejidad Técnica:** Lógica compleja de prorrateo
- **Problemas de Implementación:** Stripe no soporta nativamente
- **Experiencia de Usuario:** Confuso para suscripciones a mitad de mes
- **Mantenimiento:** Difícil de mantener y debuggear

#### **🚫 No Recomendado:**

Requiere implementación custom compleja que no justifica los beneficios.

---

### **3. COBRO POR PERÍODOS (CADA 10 DÍAS)**

#### **✅ Ventajas:**

- **Flujo de Caja Regular:** Ingresos distribuidos

#### **❌ Desventajas:**

- **Muy Complejo:** Implementación extremadamente difícil
- **Confuso para Usuarios:** Ciclos no estándar
- **Alto Mantenimiento:** Lógica compleja de fechas
- **Problemas de Escalabilidad:** No escalable

#### **🚫 No Recomendado:**

Complejidad excesiva sin beneficios claros.

---

## 🏆 **RECOMENDACIÓN FINAL: COBRO EN FECHA DE SUSCRIPCIÓN**

### **🎯 Justificación:**

1. **Simplicidad Técnica:** Implementación directa con Stripe
2. **Experiencia de Usuario:** Clara y comprensible
3. **Escalabilidad:** Fácil de mantener y escalar
4. **Flexibilidad:** Permite diferentes estrategias de precios
5. **Estándar de la Industria:** Práctica común en SaaS

---

## 🛠️ **IMPLEMENTACIÓN TÉCNICA**

### **1. Configuración de Stripe**

#### **Productos y Precios:**

```typescript
// Planes de suscripción
const plans = {
  basic: {
    name: "Plan Básico",
    price: 29.99, // USD
    interval: "month",
    features: ["5 eventos/mes", "Soporte básico"],
  },
  pro: {
    name: "Plan Pro",
    price: 59.99,
    interval: "month",
    features: ["Eventos ilimitados", "Soporte prioritario"],
  },
  enterprise: {
    name: "Plan Enterprise",
    price: 99.99,
    interval: "month",
    features: ["Todo lo anterior", "Soporte dedicado"],
  },
};
```

#### **Webhooks de Stripe:**

```typescript
// Eventos importantes a manejar
const webhookEvents = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "customer.subscription.trial_will_end",
];
```

### **2. Modelo de Base de Datos**

#### **Tabla `subscriptions`:**

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan_id UUID REFERENCES plans(id),
  status TEXT NOT NULL, -- active, canceled, past_due, unpaid
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_cycle_anchor TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabla `plans`:**

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  features JSONB,
  limits JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabla `billing_cycles`:**

```sql
CREATE TABLE billing_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- pending, paid, failed
  stripe_invoice_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Lógica de Negocio**

#### **Creación de Suscripción:**

```typescript
async function createSubscription(studioId: string, planId: string) {
  // 1. Obtener información del estudio
  const studio = await getStudio(studioId);

  // 2. Crear o obtener customer en Stripe
  const customer = await stripe.customers.create({
    email: studio.email,
    name: studio.name,
    metadata: { studio_id: studioId },
  });

  // 3. Crear suscripción con billing_cycle_anchor
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: plan.stripe_price_id }],
    billing_cycle_anchor: Math.floor(Date.now() / 1000),
    proration_behavior: "create_prorations",
    metadata: { studio_id: studioId },
  });

  // 4. Guardar en base de datos
  await saveSubscription({
    studio_id: studioId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customer.id,
    plan_id: planId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
  });
}
```

#### **Manejo de Webhooks:**

```typescript
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.updated":
      await updateSubscriptionStatus(event.data.object);
      break;

    case "invoice.payment_succeeded":
      await recordSuccessfulPayment(event.data.object);
      break;

    case "invoice.payment_failed":
      await handleFailedPayment(event.data.object);
      break;
  }
}
```

---

## 📊 **GESTIÓN DE REPORTES**

### **Reportes Mensuales:**

```typescript
async function getMonthlyRevenue(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Agregar ingresos por período de facturación
  const revenue = await db.billing_cycles.aggregate({
    where: {
      period_start: { gte: startDate },
      period_end: { lte: endDate },
      status: "paid",
    },
    _sum: { amount: true },
  });

  return revenue._sum.amount || 0;
}
```

### **Dashboard de Métricas:**

```typescript
async function getDashboardMetrics() {
  const [totalRevenue, activeSubscriptions, churnRate, mrr] = await Promise.all(
    [
      getTotalRevenue(),
      getActiveSubscriptionsCount(),
      getChurnRate(),
      getMonthlyRecurringRevenue(),
    ]
  );

  return {
    totalRevenue,
    activeSubscriptions,
    churnRate,
    mrr,
  };
}
```

---

## 🔄 **FLUJO DE SUSCRIPCIÓN**

### **1. Proceso de Suscripción:**

```
Usuario → Selecciona Plan → Checkout Stripe → Pago Exitoso →
Webhook → Crear Suscripción → Activar Estudio → Onboarding
```

### **2. Renovación Automática:**

```
Stripe → Webhook (invoice.payment_succeeded) →
Actualizar Estado → Enviar Confirmación →
Continuar Servicio
```

### **3. Manejo de Fallos:**

```
Stripe → Webhook (invoice.payment_failed) →
Notificar Usuario → Grace Period →
Suspender Servicio → Reintentar Pago
```

---

## 🚨 **CONSIDERACIONES IMPORTANTES**

### **1. Prorrateo:**

- Stripe maneja automáticamente el prorrateo
- Configurar `proration_behavior: 'create_prorations'`
- Documentar claramente al usuario

### **2. Períodos de Gracia:**

- Configurar grace period en Stripe
- Notificar usuarios antes de suspensión
- Proceso de reactivación simple

### **3. Cambios de Plan:**

- Permitir upgrades/downgrades
- Prorrateo automático
- Notificación de cambios

### **4. Cancelaciones:**

- Cancelación inmediata o al final del período
- Proceso de retención
- Exportación de datos

---

## 📈 **MÉTRICAS A TRACKING**

### **Métricas de Suscripción:**

- **MRR (Monthly Recurring Revenue)**
- **ARR (Annual Recurring Revenue)**
- **Churn Rate**
- **Customer Lifetime Value (CLV)**
- **Average Revenue Per User (ARPU)**

### **Métricas de Conversión:**

- **Trial to Paid Conversion Rate**
- **Plan Upgrade Rate**
- **Payment Success Rate**
- **Dunning Success Rate**

---

## 🎯 **PRÓXIMOS PASOS**

1. **Configurar Stripe Dashboard** con productos y precios
2. **Implementar webhooks** para manejo de eventos
3. **Crear modelo de base de datos** para suscripciones
4. **Desarrollar API endpoints** para gestión de suscripciones
5. **Implementar dashboard** de métricas de suscripciones
6. **Testing exhaustivo** del flujo de suscripción

---

**Fecha de Creación:** $(date)
**Última Actualización:** $(date)
**Responsable:** Equipo de Desarrollo ProSocial Platform
