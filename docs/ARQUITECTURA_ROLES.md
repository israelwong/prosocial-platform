# 🎯 ARQUITECTURA DE ROLES - PROSOCIAL PLATFORM

## 📊 **MODELO DE ROLES PROPUESTO**

### **🔴 OPCIÓN 1: SISTEMA UNIFICADO (Recomendado)**

```
┌─────────────────────────────────────────────────────────────┐
│                    PROSOCIAL AUTH                           │
│                  (Un solo sistema)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   SUPER ADMIN   │  │   ASESOR        │  │   SUSCRIPTOR    │
│   (ProSocial)   │  │   (ProSocial)   │  │   (Studio)      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • Gestión total │  │ • CRM Leads     │  │ • Gestión       │
│ • Revenue       │  │ • Conversiones  │  │   Studio        │
│ • Estudios      │  │ • Soporte       │  │ • Eventos       │
│ • Configuración │  │ • Ventas        │  │ • Clientes      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### **🟡 OPCIÓN 2: SISTEMAS SEPARADOS**

```
┌─────────────────┐                    ┌─────────────────┐
│  PROSOCIAL AUTH │                    │   STUDIO AUTH   │
│  (Admin/Asesor) │                    │  (Suscriptores) │
└─────────────────┘                    └─────────────────┘
```

## 🎯 **RECOMENDACIÓN: OPCIÓN 1 - SISTEMA UNIFICADO**

### **Ventajas:**

- ✅ **Un solo login** para todos los usuarios
- ✅ **Gestión centralizada** de usuarios
- ✅ **Roles dinámicos** (un usuario puede tener múltiples roles)
- ✅ **Escalabilidad** fácil
- ✅ **Menos complejidad** técnica

### **Implementación:**

#### **1. Tabla de Usuarios Unificada:**

```sql
-- Extender auth.users de Supabase
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL, -- 'super_admin', 'asesor', 'suscriptor'
  studio_id UUID REFERENCES studios(id), -- NULL para ProSocial
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. Roles y Permisos:**

```typescript
enum UserRole {
  SUPER_ADMIN = "super_admin", // ProSocial Platform
  ASESOR = "asesor", // ProSocial Platform
  SUSCRIPTOR = "suscriptor", // Studio específico
}

enum Permission {
  // Super Admin
  MANAGE_PLATFORM = "manage_platform",
  MANAGE_REVENUE = "manage_revenue",
  MANAGE_STUDIOS = "manage_studios",

  // Asesor
  MANAGE_LEADS = "manage_leads",
  MANAGE_CONVERSIONS = "manage_conversions",
  VIEW_ANALYTICS = "view_analytics",

  // Suscriptor
  MANAGE_STUDIO = "manage_studio",
  MANAGE_EVENTS = "manage_events",
  MANAGE_CLIENTS = "manage_clients",
  MANAGE_QUOTATIONS = "manage_quotations",
}
```

#### **3. Middleware de Roles:**

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const user = await getUser(request);

  if (!user) {
    return redirect("/auth/login");
  }

  const userRole = await getUserRole(user.id);
  const pathname = request.nextUrl.pathname;

  // Verificar permisos por ruta
  if (pathname.startsWith("/platform/admin") && userRole !== "super_admin") {
    return redirect("/unauthorized");
  }

  if (
    pathname.startsWith("/platform/asesor") &&
    !["super_admin", "asesor"].includes(userRole)
  ) {
    return redirect("/unauthorized");
  }

  if (pathname.startsWith("/studio/") && userRole !== "suscriptor") {
    return redirect("/unauthorized");
  }
}
```

## 🚀 **FLUJO DE LOGIN UNIFICADO**

### **1. Login Page:**

```
┌─────────────────────────────────────┐
│        PROSOCIAL PLATFORM           │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │        INICIAR SESIÓN           │ │
│  │                                 │ │
│  │  Email: [________________]      │ │
│  │  Password: [____________]       │ │
│  │                                 │ │
│  │  [    INICIAR SESIÓN    ]       │ │
│  │                                 │ │
│  │  ¿No tienes cuenta?             │ │
│  │  [Registrarse]                  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **2. Redirección por Rol:**

```typescript
// Después del login exitoso
const userRole = await getUserRole(user.id);

switch (userRole) {
  case "super_admin":
    router.push("/platform/admin");
    break;
  case "asesor":
    router.push("/platform/asesor");
    break;
  case "suscriptor":
    const studio = await getUserStudio(user.id);
    router.push(`/studio/${studio.slug}`);
    break;
  default:
    router.push("/unauthorized");
}
```

## 📋 **IMPLEMENTACIÓN PASO A PASO**

### **Fase 4.1: Sistema de Roles (Esta Semana)**

1. ✅ Crear tabla `user_profiles`
2. ✅ Implementar middleware de roles
3. ✅ Crear páginas por rol
4. ✅ Sistema de redirección

### **Fase 4.2: Registro por Rol (Próxima Semana)**

1. ✅ Formulario de registro con selección de rol
2. ✅ Validación de roles
3. ✅ Onboarding por tipo de usuario

## 🎯 **BENEFICIOS DEL SISTEMA UNIFICADO**

### **Para ProSocial:**

- ✅ **Control total** de usuarios
- ✅ **Analytics unificados**
- ✅ **Gestión centralizada**
- ✅ **Escalabilidad**

### **Para Estudios:**

- ✅ **Un solo login** para todo
- ✅ **Experiencia consistente**
- ✅ **Fácil onboarding**

### **Para Desarrollo:**

- ✅ **Menos complejidad**
- ✅ **Mantenimiento fácil**
- ✅ **Testing simplificado**

## ❓ **DECISIÓN REQUERIDA**

**¿Implementamos el sistema unificado de roles?**

**Ventajas:**

- Un solo login para todos
- Gestión centralizada
- Escalabilidad

**Desventajas:**

- Más complejo inicialmente
- Requiere planificación de permisos

---

**Recomendación:** ✅ **SÍ, implementar sistema unificado**

¿Procedemos con esta arquitectura?
