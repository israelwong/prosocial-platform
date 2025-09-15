# Sistema de Autenticación de Agentes

## 🎯 **Flujo Completo de Gestión de Agentes**

### **1. Creación de Agente (Administrador)**

Cuando un administrador crea un agente desde `/admin/agents/new`:

1. **Formulario de creación** - El admin llena:
   - Nombre completo
   - Email
   - Teléfono
   - Estado (activo/inactivo)
   - Meta mensual de leads
   - Comisión por conversión

2. **API `/api/admin/agents` (POST)**:
   - ✅ Genera contraseña temporal automáticamente
   - ✅ Crea usuario en **Supabase Auth** con email confirmado
   - ✅ Crea registro en tabla `ProSocialAgent`
   - ✅ Crea perfil en tabla `UserProfile` con rol 'agente'
   - ✅ Sincroniza IDs entre Supabase Auth y base de datos

3. **Resultado**:
   - ✅ Usuario creado en Supabase Auth
   - ✅ Agente visible en panel de administración
   - ✅ Credenciales temporales mostradas al administrador

### **2. Credenciales del Agente**

**Email**: El email proporcionado por el administrador
**Contraseña**: Generada automáticamente (ej: `Agente8x9mK2p!`)
**URL de acceso**: `https://tu-dominio.com/agente`

### **3. Primer Login del Agente**

1. El agente va a `/agente`
2. Es redirigido a login de Supabase
3. Ingresa sus credenciales temporales
4. **Debe cambiar su contraseña** en el primer login
5. Es redirigido a su panel de agente

### **4. Panel del Agente (`/agente`)**

Una vez autenticado, el agente accede a:

- Dashboard con métricas personales
- Lista de leads asignados
- Kanban board para gestión de leads
- Actividades y reportes

### **5. Estados de Autenticación**

En el panel de administración, cada agente muestra:

- 🟢 **Con acceso**: Ya hizo login al menos una vez
- 🟡 **Pendiente login**: Creado pero nunca ha ingresado
- 🔴 **Bloqueado**: Desactivado por el administrador
- 🔴 **Sin acceso**: Error en la creación del usuario Auth

### **6. Gestión por Administrador**

#### **Activar/Desactivar Agente**:

- ✅ Cambiar estado en la base de datos
- ✅ Bloquear/desbloquear usuario en Supabase Auth
- ✅ Sincronización automática

#### **Reenviar Credenciales**:

- ✅ Generar nueva contraseña temporal
- ✅ Actualizar en Supabase Auth
- ✅ Mostrar credenciales al administrador (en desarrollo)
- 🚧 TODO: Enviar por email (producción)

#### **Verificar Estado**:

- ✅ API `/api/admin/agents/[id]/auth-status`
- ✅ Información de último login
- ✅ Estado de bloqueo/activación

## 🔧 **APIs Implementadas**

### **Crear Agente**

```
POST /api/admin/agents
```

- Crea usuario en Supabase Auth
- Crea registros en BD
- Retorna credenciales temporales

### **Actualizar Agente**

```
PUT /api/admin/agents/[id]
```

- Actualiza datos del agente
- Sincroniza estado con Supabase Auth
- Maneja activación/desactivación

### **Estado de Autenticación**

```
GET /api/admin/agents/[id]/auth-status
```

- Verifica existencia en Supabase Auth
- Retorna información de login
- Estado de bloqueo

### **Reenviar Credenciales**

```
POST /api/admin/agents/[id]/resend-credentials
```

- Genera nueva contraseña temporal
- Actualiza en Supabase Auth
- Retorna nuevas credenciales

## 🎯 **Casos de Uso Resueltos**

### **Caso 1: Crear Nuevo Agente**

1. Admin crea agente → Sistema genera credenciales
2. Admin comparte credenciales con el agente
3. Agente hace login y cambia contraseña
4. Admin ve estado "Con acceso" ✅

### **Caso 2: Desactivar Agente**

1. Admin desactiva agente en panel
2. Sistema bloquea usuario en Supabase Auth
3. Agente no puede hacer login
4. Admin ve estado "Bloqueado" ✅

### **Caso 3: Reactivar Agente**

1. Admin reactiva agente
2. Sistema desbloquea usuario en Supabase Auth
3. Agente puede volver a hacer login
4. Admin ve estado actualizado ✅

### **Caso 4: Agente Olvidó Contraseña**

1. Admin usa "Reenviar Credenciales"
2. Sistema genera nueva contraseña temporal
3. Admin comparte nuevas credenciales
4. Agente puede volver a ingresar ✅

## 🔐 **Seguridad**

- ✅ **Contraseñas temporales** complejas generadas automáticamente
- ✅ **Sincronización** entre BD y Supabase Auth
- ✅ **Bloqueo inmediato** al desactivar agente
- ✅ **Roles y permisos** mediante Supabase RLS
- 🚧 **TODO**: Envío seguro de credenciales por email

## 🚀 **Estado Actual**

- ✅ **Sistema completo funcionando**
- ✅ **Creación automática de usuarios Auth**
- ✅ **Sincronización de estados**
- ✅ **Panel de administración con estados**
- ✅ **Reenvío de credenciales**
- 🚧 **Pendiente**: Envío automático de emails
- 🚧 **Pendiente**: Forzar cambio de contraseña en primer login
