# 🔐 Guía para Crear Usuarios en Supabase Auth

## 📋 Pasos para Crear Usuarios

### **Paso 1: Acceder a Supabase Dashboard**

1. Ve a: https://fhwfdwrrnwkbnwxabkcq.supabase.co
2. Inicia sesión con tu cuenta de Supabase

### **Paso 2: Ir a Authentication**

1. En el menú lateral, haz clic en **"Authentication"**
2. Luego haz clic en **"Users"**

### **Paso 3: Crear Usuario Super Admin**

1. Haz clic en **"Add user"**
2. Completa los campos:
   - **Email:** `admin@prosocial.com`
   - **Password:** `admin123`
   - **Auto Confirm User:** ✅ (marcar esta casilla)
3. Haz clic en **"Create user"**
4. **Copia el User ID** que se genera (lo necesitaremos después)

### **Paso 4: Crear Usuario Asesor**

1. Haz clic en **"Add user"**
2. Completa los campos:
   - **Email:** `asesor@prosocial.com`
   - **Password:** `asesor123`
   - **Auto Confirm User:** ✅ (marcar esta casilla)
3. Haz clic en **"Create user"**
4. **Copia el User ID** que se genera

### **Paso 5: Crear Usuario Suscriptor**

1. Haz clic en **"Add user"**
2. Completa los campos:
   - **Email:** `suscriptor@prosocial.com`
   - **Password:** `suscriptor123`
   - **Auto Confirm User:** ✅ (marcar esta casilla)
3. Haz clic en **"Create user"**
4. **Copia el User ID** que se genera

### **Paso 6: Actualizar IDs en el Script**

1. Abre el archivo: `prisma/create-user-profiles.ts`
2. Reemplaza los IDs placeholder con los IDs reales:
   ```typescript
   const userProfiles = [
     {
       id: "TU_USER_ID_ADMIN_AQUI", // Reemplazar con el ID real
       email: "admin@prosocial.com",
       fullName: "Administrador ProSocial",
       role: "super_admin",
       isActive: true,
     },
     // ... etc
   ];
   ```

### **Paso 7: Ejecutar el Script**

```bash
npm run db:create-profiles
```

### **Paso 8: Verificar**

1. Ve a: http://localhost:3000/auth/login
2. Prueba las credenciales:
   - `admin@prosocial.com` / `admin123`
   - `asesor@prosocial.com` / `asesor123`
   - `suscriptor@prosocial.com` / `suscriptor123`

---

## 🔍 **Cómo Obtener el User ID**

### **Método 1: Desde Supabase Dashboard**

1. Ve a Authentication > Users
2. Haz clic en el usuario que creaste
3. Copia el **"User UID"** que aparece en la parte superior

### **Método 2: Desde la Consola del Navegador**

1. Inicia sesión en la aplicación
2. Abre las herramientas de desarrollador (F12)
3. En la consola, ejecuta:
   ```javascript
   console.log(
     "User ID:",
     (await window.supabase.auth.getUser()).data.user?.id
   );
   ```

---

## ⚠️ **Solución de Problemas**

### **Error: "Invalid login credentials"**

- Verifica que el email y contraseña sean exactos
- Asegúrate de que "Auto Confirm User" esté marcado
- Verifica que el usuario esté activo en Supabase

### **Error: "User not found"**

- Verifica que el User ID en el script coincida con el de Supabase
- Ejecuta `npm run db:create-profiles` después de actualizar los IDs

### **Error: "Permission denied"**

- Verifica que el usuario tenga el rol correcto en la base de datos
- Revisa las políticas de RLS en Supabase

---

## 📱 **URLs de Prueba**

Una vez creados los usuarios, puedes probar:

- **Login:** http://localhost:3000/auth/login
- **Admin Dashboard:** http://localhost:3000/platform/admin/dashboard
- **Gestión de Estudios:** http://localhost:3000/platform/admin/studios
- **Gestión de Leads:** http://localhost:3000/platform/admin/leads

---

_Guía creada para ProSocial Platform - Última actualización: $(date)_
