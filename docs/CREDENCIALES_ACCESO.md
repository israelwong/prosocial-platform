# 🔐 Credenciales de Acceso - ProSocial Platform

## 📋 Información de Acceso

### 🌐 **URLs de Acceso**

- **Aplicación Principal:** http://localhost:3001
- **Panel de Administración:** http://localhost:3001/platform/admin/dashboard
- **Login:** http://localhost:3001/auth/login
- **Registro:** http://localhost:3001/auth/sign-up

---

## 👥 **Usuarios de Prueba Generados**

### 🔑 **Super Administrador**

```
Email: admin@prosocial.com
Contraseña: admin123
Rol: super_admin
Acceso: Panel completo de administración
```

### 🔑 **Asesor Comercial**

```
Email: asesor@prosocial.com
Contraseña: asesor123
Rol: asesor
Acceso: Dashboard de asesores, gestión de leads
```

### 🔑 **Suscriptor de Estudio**

```
Email: suscriptor@prosocial.com
Contraseña: suscriptor123
Rol: suscriptor
Acceso: Panel del estudio, gestión de eventos
```

---

## ⚠️ **IMPORTANTE: Crear Usuarios Manualmente**

**Los usuarios deben crearse manualmente en Supabase Auth:**

1. **Ve a:** https://fhwfdwrrnwkbnwxabkcq.supabase.co
2. **Inicia sesión** en tu cuenta de Supabase
3. **Ve a:** Authentication > Users
4. **Crea los usuarios** con las credenciales de arriba
5. **Marca "Auto Confirm User"** para cada usuario (importante)
6. **Copia los User IDs** para actualizar el script

### 🔧 **Configuración de Email Templates**

Para que funcione correctamente, también necesitas:

1. **Ve a:** Authentication > Email Templates
2. **En "Confirm signup"** cambia la URL a:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

---

## 🎯 **Funcionalidades por Rol**

### **Super Administrador (admin@prosocial.com)**

- ✅ Gestión completa de estudios
- ✅ Gestión de leads
- ✅ Análisis de revenue
- ✅ Analytics de la plataforma
- ✅ Configuración del sistema
- ✅ Gestión de usuarios y permisos

### **Asesor Comercial (asesor@prosocial.com)**

- ✅ Dashboard de leads asignados
- ✅ Seguimiento de conversiones
- ✅ Gestión de clientes potenciales
- ✅ Reportes de ventas
- ✅ Comunicación con leads

### **Suscriptor de Estudio (suscriptor@prosocial.com)**

- ✅ Panel del estudio
- ✅ Gestión de eventos
- ✅ Configuración del perfil
- ✅ Estadísticas del estudio
- ✅ Gestión de clientes

---

## 🚀 **Cómo Acceder**

### **Paso 1: Ir al Login**

1. Abre http://localhost:3001/auth/login
2. Ingresa las credenciales del usuario que desees probar

### **Paso 2: Seleccionar Rol (Solo en registro)**

- Si es la primera vez, el sistema te pedirá completar el perfil
- Selecciona el rol correspondiente

### **Paso 3: Acceder al Panel**

- El sistema te redirigirá automáticamente según tu rol
- O navega manualmente a las URLs específicas

---

## 🔧 **Configuración de Base de Datos**

### **Comando para Sembrar Datos**

```bash
npm run db:seed
```

### **Comando para Resetear Base de Datos**

```bash
npm run db:push
```

---

## 📱 **URLs Específicas por Panel**

### **Administración**

- Dashboard: http://localhost:3001/platform/admin/dashboard
- Estudios: http://localhost:3001/platform/admin/studios
- Leads: http://localhost:3001/platform/admin/leads
- Revenue: http://localhost:3001/platform/admin/revenue
- Analytics: http://localhost:3001/platform/admin/analytics

### **Asesor**

- Dashboard: http://localhost:3001/platform/asesor/dashboard
- Leads: http://localhost:3001/platform/asesor/leads
- Clientes: http://localhost:3001/platform/asesor/clientes

### **Suscriptor**

- Panel del Estudio: http://localhost:3001/studio/[slug]
- Eventos: http://localhost:3001/studio/[slug]/eventos
- Configuración: http://localhost:3001/studio/[slug]/configuracion

---

## ⚠️ **Notas Importantes**

1. **Contraseñas:** Todas las contraseñas son temporales para desarrollo
2. **Base de Datos:** Asegúrate de que la base de datos esté sincronizada
3. **Variables de Entorno:** Verifica que `.env.local` esté configurado
4. **Supabase:** Confirma que la conexión esté activa

---

## 🆘 **Solución de Problemas**

### **Error de Login**

- Verifica que el usuario exista en la base de datos
- Ejecuta `npm run db:seed` para recrear usuarios
- Revisa la consola del navegador para errores

### **Error de Permisos**

- Confirma que el rol esté asignado correctamente
- Verifica el middleware de autenticación
- Revisa las políticas de RLS en Supabase

### **Error de Conexión**

- Verifica las variables de entorno
- Confirma que Supabase esté funcionando
- Revisa la configuración del cliente

---

## 📞 **Contacto de Soporte**

Si tienes problemas de acceso, revisa:

1. La consola del navegador
2. Los logs del servidor
3. La configuración de Supabase
4. Las variables de entorno

---

_Última actualización: $(date)_
