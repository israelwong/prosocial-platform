# 🌱 Seeds de Base de Datos - ZEN Platform

## 📋 Descripción

Sistema modular de seeds para inicializar la base de datos con datos de prueba y configuración.

## 🚀 Seeds Disponibles

### 1. Seed Principal (`seed.ts`)

**Comando:** `npm run db:seed`

Inicializa la plataforma completa:

- ✅ Módulos de plataforma
- ✅ Redes sociales
- ✅ Canales de adquisición
- ✅ Planes con límites
- ✅ Demo Studio configurado
- ✅ Pipelines Marketing + Manager
- ✅ Catálogo de servicios
- ✅ Tipos de evento
- ✅ Demo Lead

### 2. Seed Usuarios Demo (`seed-demo-users.ts`)

**Comando:** `npm run db:seed-demo-users`

Crea usuarios de prueba con contraseñas hardcodeadas:

| Usuario      | Email                     | Contraseña | Rol                       | Acceso       |
| ------------ | ------------------------- | ---------- | ------------------------- | ------------ |
| Super Admin  | admin@prosocial.mx        | Admin123!  | SUPER_ADMIN               | /admin       |
| Studio Owner | owner@demo-studio.com     | Owner123!  | SUSCRIPTOR + OWNER        | /demo-studio |
| Fotógrafo    | fotografo@demo-studio.com | Foto123!   | SUSCRIPTOR + PHOTOGRAPHER | /demo-studio |

## 🔧 Uso Recomendado

### Para Desarrollo Completo

```bash
# 1. Inicializar plataforma
npm run db:seed

# 2. Crear usuarios demo
npm run db:seed-demo-users
```

### Para Reset Completo

```bash
# Reset completo con datos
npm run db:reset
```

### Solo Usuarios Demo

```bash
# Solo crear usuarios (requiere que exista el studio)
npm run db:seed-demo-users
```

## 🔐 Credenciales de Acceso

### Super Admin

- **Email:** admin@prosocial.mx
- **Contraseña:** Admin123!
- **URL:** /admin

### Studio Owner

- **Email:** owner@demo-studio.com
- **Contraseña:** Owner123!
- **URL:** /demo-studio

### Fotógrafo

- **Email:** fotografo@demo-studio.com
- **Contraseña:** Foto123!
- **URL:** /demo-studio

## 📝 Notas Importantes

1. **Supabase Auth:** Los usuarios se crean tanto en Supabase Auth como en la base de datos
2. **Contraseñas:** Hardcodeadas para desarrollo, cambiar en producción
3. **Studio Demo:** Requiere que exista el studio con slug `demo-studio`
4. **Roles:** Se asignan automáticamente los roles de plataforma y studio

## 🛠️ Personalización

### Cambiar Contraseñas

Editar el array `DEMO_USERS` en `seed-demo-users.ts`:

```typescript
const DEMO_USERS = [
  {
    email: "admin@prosocial.mx",
    password: "TuNuevaContraseña123!", // ← Cambiar aquí
    // ...
  },
];
```

### Agregar Usuarios

Agregar nuevos usuarios al array `DEMO_USERS`:

```typescript
{
    email: 'nuevo@demo-studio.com',
    password: 'Nueva123!',
    full_name: 'Nuevo Usuario',
    phone: '+52 33 0000 0000',
    platform_role: 'SUSCRIPTOR' as const,
    studio_role: 'PHOTOGRAPHER' as const,
},
```

## 🔄 Flujo de Desarrollo

1. **Primera vez:** `npm run db:reset`
2. **Cambios en datos:** `npm run db:seed`
3. **Cambios en usuarios:** `npm run db:seed-demo-users`
4. **Reset completo:** `npm run db:reset`

## ⚠️ Advertencias

- **NO usar en producción:** Las contraseñas están hardcodeadas
- **Supabase Keys:** Requiere `SUPABASE_SERVICE_ROLE_KEY` en `.env`
- **Studio existente:** El seed de usuarios requiere que exista el studio demo
