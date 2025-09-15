# 🎯 ANÁLISIS SCHEMA: PROSOCIAL PLATFORM

## 📊 FLUJO DE TRABAJO vs SCHEMA ACTUAL

### 🚀 FLUJO PROSOCIAL PLATFORM (Objetivo)

```
┌─────────────────────┐
│   PROSOCIAL ADMIN   │
├─────────────────────┤
│ • CRM Leads         │
│ • Gestión Agentes   │
│ • Revenue Products  │
│ • Métricas          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  PROSOCIAL AGENT    │
├─────────────────────┤
│ • Pipeline Leads    │
│ • Seguimiento       │
│ • Actividades       │
│ • Conversiones      │
└─────────┬───────────┘
          │
          ▼ (conversión)
┌─────────────────────┐
│      STUDIO         │
├─────────────────────┤
│ • Proyectos/Eventos │
│ • Clientes          │
│ • Cotizaciones      │
│ • Agenda            │
│ • Finanzas          │
│ • Productos B2B2C   │
└─────────────────────┘
```

### 🗂️ MODELOS CLAVE NECESARIOS

#### ✅ **PROSOCIAL PLATFORM LAYER**

- `ProSocialLead` → Pipeline comercial
- `ProSocialAgent` → Agentes de venta
- `ProSocialActivity` → Seguimiento
- `RevenueProduct` → Productos B2B2C
- `StudioRevenueProduct` → Activación por studio

#### ✅ **STUDIO LAYER (Core Business)**

- `Studio` → Clientes de la plataforma
- `StudioUser` → Usuarios por studio
- `Cliente` → Clientes finales del studio
- `Evento` → Proyectos/eventos del studio
- `Cotizacion` → Sistema de cotizaciones
- `Agenda` → Calendario y disponibilidad
- `Pago` → Transacciones y revenue share

#### ✅ **SUPPORTING MODELS**

- `Plan` → Suscripciones SaaS
- `RevenueTransaction` → Revenue sharing
- `Servicio`, `Paquete` → Catálogo del studio

### ❌ MODELOS LEGACY INNECESARIOS

#### 🗑️ **ANUNCIOS SYSTEM** (No aplica en nuevo modelo)

```
❌ AnuncioPlataforma
❌ AnuncioTipo
❌ AnuncioCategoria
❌ Anuncio
❌ AnuncioVisita
```

**Razón**: En ProSocial Platform no manejamos anuncios publicitarios, sino productos B2B2C integrados.

#### 🗑️ **SOLICITUDES SYSTEM** (Reemplazado por metadatos)

```
❌ SolicitudPaquete
```

**Razón**: Como mencionas, todo se maneja por metadatos en notificaciones.

#### 🤔 **REVISAR UTILIDAD**

```
⚠️  Campania → ¿Necesario para marketing del studio?
⚠️  MetodoPago → ¿Simplificar a configuración JSON?
⚠️  CondicionesComerciales → ¿Mover a configuración studio?
```

### 🎯 SCHEMA OPTIMIZADO PROPUESTO

#### **LAYER 1: PROSOCIAL PLATFORM**

```
ProSocialLead (CRM)
├── ProSocialAgent (Asignado)
├── ProSocialActivity[] (Seguimiento)
└── Studio? (Si convierte)

RevenueProduct (B2B2C)
└── StudioRevenueProduct[] (Activaciones)
```

#### **LAYER 2: STUDIO OPERATIONS**

```
Studio (Tenant)
├── Plan (Suscripción)
├── StudioUser[] (Equipo)
├── Cliente[] (Clientes finales)
├── Evento[] (Proyectos)
│   ├── Cotizacion[] (Presupuestos)
│   ├── Pago[] (Transacciones)
│   └── Agenda[] (Calendario)
├── Servicio[] (Catálogo)
├── Paquete[] (Bundles)
└── StudioRevenueProduct[] (Productos B2B2C)
```

#### **LAYER 3: REVENUE SHARING**

```
RevenueTransaction
├── Studio (Origen)
├── Pago (Transacción)
└── RevenueProduct? (Si es B2B2C)
```

## 🚀 BENEFICIOS DEL SCHEMA OPTIMIZADO

1. **🎯 Enfoque claro** - Cada modelo tiene propósito específico
2. **⚡ Performance** - Menos relaciones complejas
3. **🧩 Escalabilidad** - Separación clara de responsabilidades
4. **🛠️ Mantenimiento** - Código más limpio y entendible
5. **💰 Revenue Focus** - Modelos alineados al negocio

## ❓ DECISIONES PENDIENTES

1. **¿Eliminar modelos Anuncio?** → SÍ (no aplican)
2. **¿Eliminar SolicitudPaquete?** → SÍ (usas metadatos)
3. **¿Simplificar Campania?** → Evaluar utilidad real
4. **¿MetodoPago como JSON?** → Simplificar configuración
5. **¿CondicionesComerciales necesario?** → ¿O parte de Studio config?

¿Procedemos con la limpieza del schema?
