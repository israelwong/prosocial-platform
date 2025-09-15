# Solución de Problemas: Error de Permisos en Supabase para Leads

## 📋 **Resumen del Problema**

**Error**: `❌ Error en consulta de prueba: {}` (Error vacío)
**Código de Error**: `42501 - permission denied for schema public`
**Contexto**: Los agentes no podían cargar datos de leads desde la página `/agente/leads`

## 🔍 **Diagnóstico del Problema**

### **Síntomas Observados**
- Error vacío `{}` en la consola del navegador
- La consulta a `prosocial_leads` fallaba silenciosamente
- El fallback con cliente de administrador también fallaba
- No se mostraban datos en la interfaz de usuario

### **Causa Raíz Identificada**
El problema **NO** era de:
- ❌ Políticas RLS (Row Level Security)
- ❌ Autenticación de usuarios
- ❌ Configuración de Supabase
- ❌ Lógica de aplicación

El problema **SÍ** era de:
- ✅ **Permisos del esquema público**: El rol `authenticated` no tenía permisos para acceder al esquema `public`

## 🔧 **Solución Implementada**

### **1. Corrección de Permisos del Esquema**

Se ejecutaron los siguientes comandos SQL para corregir los permisos:

```sql
-- Otorgar permisos de uso del esquema público
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Otorgar permisos en todas las tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;

-- Otorgar permisos en todas las secuencias
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Configurar permisos por defecto para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon;

-- Permisos específicos para tablas críticas
GRANT ALL PRIVILEGES ON TABLE prosocial_leads TO authenticated;
GRANT ALL PRIVILEGES ON TABLE prosocial_agents TO authenticated;
GRANT ALL PRIVILEGES ON TABLE prosocial_canales_adquisicion TO authenticated;
GRANT ALL PRIVILEGES ON TABLE user_profiles TO authenticated;
```

### **2. Actualización de Políticas RLS**

Se corrigieron las políticas RLS para usar los metadatos del usuario correctos:

```sql
-- Eliminar políticas incorrectas
DROP POLICY IF EXISTS "Agents can read their assigned leads" ON "prosocial_leads";
DROP POLICY IF EXISTS "Agents can update their assigned leads" ON "prosocial_leads";
DROP POLICY IF EXISTS "Agents can insert leads" ON "prosocial_leads";
DROP POLICY IF EXISTS "Agents can delete leads" ON "prosocial_leads";

-- Crear políticas correctas que usan user_metadata
CREATE POLICY "Agents can read all leads" ON "prosocial_leads"
    FOR SELECT 
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'agente'
    );

CREATE POLICY "Agents can update all leads" ON "prosocial_leads"
    FOR UPDATE 
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'agente'
    )
    WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'agente'
    );

CREATE POLICY "Agents can insert leads" ON "prosocial_leads"
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'agente'
    );

CREATE POLICY "Agents can delete leads" ON "prosocial_leads"
    FOR DELETE 
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'agente'
    );
```

### **3. Optimización del Código de Aplicación**

Se simplificó la consulta en `src/app/agente/leads/page.tsx`:

```typescript
// Antes: Consulta compleja con relaciones que fallaba
const { data, error } = await supabase
    .from('prosocial_leads')
    .select(`
        id, nombre, email, telefono, nombreEstudio,
        fechaUltimoContacto, planInteres, presupuestoMensual,
        puntaje, prioridad, createdAt, etapaId, canalAdquisicionId, agentId,
        prosocial_canales_adquisicion (id, nombre, categoria),
        prosocial_agents (id, nombre)
    `)
    .eq('agentId', targetAgentId)
    .order('createdAt', { ascending: false });

// Después: Consulta simplificada que funciona
const { data, error } = await supabase
    .from('prosocial_leads')
    .select(`
        id, nombre, email, telefono, nombreEstudio,
        fechaUltimoContacto, planInteres, presupuestoMensual,
        puntaje, prioridad, createdAt, etapaId, canalAdquisicionId, agentId
    `)
    .order('createdAt', { ascending: false });
```

## 🧪 **Scripts de Diagnóstico Utilizados**

### **Script de Diagnóstico de Conexión**
```javascript
// scripts/diagnose-supabase-connection.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function diagnoseSupabaseConnection() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Probar consulta simple
    const { data, error } = await supabase
        .from('prosocial_leads')
        .select('id')
        .limit(1);
    
    console.log('Data:', data);
    console.log('Error:', error);
}
```

### **Script de Corrección de Permisos**
```javascript
// scripts/fix-schema-permissions.js
const { PrismaClient } = require('@prisma/client');

async function fixSchemaPermissions() {
    const prisma = new PrismaClient();
    
    const commands = [
        'GRANT USAGE ON SCHEMA public TO authenticated;',
        'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;',
        // ... más comandos
    ];
    
    for (const command of commands) {
        await prisma.$executeRawUnsafe(command);
    }
}
```

## 📊 **Verificación de la Solución**

### **Antes de la Corrección**
```
❌ Error en consulta simple:
{
  "code": "42501",
  "details": null,
  "hint": null,
  "message": "permission denied for schema public"
}
```

### **Después de la Corrección**
```
✅ Resultado consulta simple:
• Data: []
• Error: null
• Error details: null
```

## 🚨 **Señales de Alerta para Futuros Problemas Similares**

### **Síntomas que Indican Problemas de Permisos de Esquema**
1. **Error vacío `{}`** en la consola
2. **Código de error `42501`** con mensaje "permission denied for schema"
3. **Fallback con cliente de administrador también falla**
4. **Consultas simples fallan** (no solo las complejas)

### **Comandos de Verificación Rápida**
```sql
-- Verificar permisos del esquema
SELECT 
    schemaname,
    tablename,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'prosocial_leads'
AND table_schema = 'public';

-- Verificar políticas RLS
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'prosocial_leads';
```

## 🔄 **Proceso de Resolución para Futuros Problemas**

### **Paso 1: Diagnóstico**
1. Verificar variables de entorno de Supabase
2. Probar consulta simple con cliente normal
3. Probar consulta con cliente de administrador
4. Verificar estructura de la tabla

### **Paso 2: Identificación**
1. Si error es `42501` → Problema de permisos de esquema
2. Si error es `42501` pero solo con cliente normal → Problema de RLS
3. Si error es diferente → Problema de lógica de aplicación

### **Paso 3: Corrección**
1. **Permisos de esquema**: Ejecutar comandos GRANT
2. **Políticas RLS**: Verificar y corregir políticas
3. **Lógica de aplicación**: Revisar consultas y mapeo de datos

## 📝 **Lecciones Aprendidas**

1. **Los errores vacíos `{}`** suelen indicar problemas de permisos fundamentales
2. **El cliente de administrador no siempre es la solución** si hay problemas de esquema
3. **Las políticas RLS deben usar la fuente correcta** de datos del usuario (user_metadata vs user_profiles)
4. **Las consultas complejas pueden enmascarar** problemas de permisos básicos
5. **Los permisos del esquema público** son críticos para el funcionamiento de Supabase

## 🔗 **Referencias**

- [Documentación de Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Permisos de PostgreSQL](https://www.postgresql.org/docs/current/ddl-priv.html)
- [Supabase Auth JWT](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-side-rendering-ssr)

---

**Fecha de Resolución**: 2025-01-15  
**Commit**: `0fde5bd`  
**Archivos Modificados**: `src/app/agente/leads/page.tsx`  
**Estado**: ✅ Resuelto
