# Guía Rápida: Errores Comunes de Supabase

## 🚨 **Errores de Permisos**

### **Error: `permission denied for schema public` (42501)**
**Causa**: El rol `authenticated` no tiene permisos en el esquema público
**Solución**:
```sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
```

### **Error: `permission denied for table` (42501)**
**Causa**: Permisos específicos de tabla faltantes
**Solución**:
```sql
GRANT ALL PRIVILEGES ON TABLE nombre_tabla TO authenticated;
```

## 🔐 **Errores de RLS (Row Level Security)**

### **Error: `new row violates row-level security policy`**
**Causa**: Política RLS bloquea la inserción
**Solución**: Verificar políticas INSERT y WITH CHECK

### **Error: `insufficient_privilege`**
**Causa**: Política RLS no permite la operación
**Solución**: Revisar políticas USING y WITH CHECK

## 🔑 **Errores de Autenticación**

### **Error: `JWT expired`**
**Causa**: Token de autenticación expirado
**Solución**: Refrescar sesión o reautenticar

### **Error: `Invalid JWT`**
**Causa**: Token malformado o inválido
**Solución**: Verificar configuración de Supabase

## 📊 **Errores de Consulta**

### **Error: `column does not exist`**
**Causa**: Columna no existe en la tabla
**Solución**: Verificar esquema de la tabla

### **Error: `relation does not exist`**
**Causa**: Tabla no existe
**Solución**: Verificar nombre de tabla y esquema

## 🛠️ **Comandos de Diagnóstico**

### **Verificar Permisos**
```sql
SELECT 
    schemaname,
    tablename,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'nombre_tabla';
```

### **Verificar Políticas RLS**
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'nombre_tabla';
```

### **Verificar Estructura de Tabla**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'nombre_tabla'
AND table_schema = 'public';
```

## 🔍 **Script de Diagnóstico Rápido**

```javascript
// Diagnóstico básico de Supabase
const { createClient } = require('@supabase/supabase-js');

async function quickDiagnosis() {
    const supabase = createClient(url, key);
    
    // Test 1: Conexión básica
    const { data, error } = await supabase
        .from('nombre_tabla')
        .select('id')
        .limit(1);
    
    console.log('Test 1 - Conexión:', { data, error });
    
    // Test 2: Autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Test 2 - Auth:', { user: user?.id, error: authError });
}
```

## 📋 **Checklist de Resolución**

- [ ] Verificar variables de entorno
- [ ] Probar consulta simple
- [ ] Verificar permisos de esquema
- [ ] Revisar políticas RLS
- [ ] Comprobar autenticación
- [ ] Validar estructura de datos
- [ ] Probar con cliente de administrador

---

**Última actualización**: 2025-01-15
