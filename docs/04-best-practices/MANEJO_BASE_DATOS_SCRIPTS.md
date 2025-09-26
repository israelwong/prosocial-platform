# 🗄️ **MANEJO DE BASE DE DATOS EN SCRIPTS**

## 📋 **PROBLEMA IDENTIFICADO**

Durante la implementación del perfil de usuario, se encontraron **problemas persistentes** con las conexiones de Prisma al ejecutar scripts de Node.js para inyectar datos en la base de datos.

### **❌ Errores Encontrados:**
```
PrismaClientUnknownRequestError: 
Invalid `prisma.projects.findUnique()` invocation
Error occurred during query execution:
ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: "42P05", message: "prepared statement \"s0\" already exists", severity: "ERROR", detail: None, column: None, hint: None }), transient: false })
```

### **🔍 Causa Raíz:**
- **Múltiples instancias** de PrismaClient ejecutándose simultáneamente
- **Prepared statements** duplicados en PostgreSQL
- **Conexiones no liberadas** correctamente
- **Conflicto** entre cliente singleton y nuevas instancias

---

## ✅ **SOLUCIONES IMPLEMENTADAS**

### **1. Enfoque SQL Directo (RECOMENDADO)**

**✅ Ventajas:**
- **Sin dependencias** de Prisma Client
- **Ejecución directa** en PostgreSQL
- **Sin problemas** de conexiones
- **Más rápido** y confiable

**📝 Implementación:**
```bash
# Cargar variables de entorno
source .env.local

# Ejecutar consultas SQL directamente
psql $DATABASE_URL -c "SELECT id, name, slug FROM projects WHERE slug = 'demo-studio';"

# Insertar datos
psql $DATABASE_URL -c "INSERT INTO platform_leads (...) VALUES (...);"
```

**🎯 Casos de Uso:**
- ✅ **Verificación** de datos existentes
- ✅ **Inserción** de registros de prueba
- ✅ **Consultas** de diagnóstico
- ✅ **Limpieza** de datos

### **2. Scripts TypeScript con Cliente Singleton**

**✅ Ventajas:**
- **Reutiliza** la configuración existente
- **Consistente** con el proyecto
- **Tipado** fuerte

**📝 Implementación:**
```typescript
// scripts/verificar-datos.ts
import { prisma } from '../src/lib/prisma';

async function verificarDatos() {
  try {
    const proyecto = await prisma.projects.findUnique({
      where: { slug: 'demo-studio' }
    });
    
    console.log('Proyecto:', proyecto);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDatos();
```

**🚀 Ejecución:**
```bash
npx tsx scripts/verificar-datos.ts
```

### **3. Scripts JavaScript con Nueva Instancia (PROBLEMÁTICO)**

**❌ Problemas:**
- **Conflictos** de conexiones
- **Prepared statements** duplicados
- **Inconsistencias** con el cliente principal

**⚠️ Evitar:**
```javascript
// ❌ NO RECOMENDADO
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Puede causar conflictos
```

---

## 🛠️ **MEJORES PRÁCTICAS**

### **1. Para Verificación de Datos**

**✅ Usar SQL Directo:**
```bash
# Verificar proyecto
source .env.local
psql $DATABASE_URL -c "SELECT id, name, slug FROM projects WHERE slug = 'demo-studio';"

# Verificar lead asociado
psql $DATABASE_URL -c "SELECT id, name, email, \"studioId\" FROM platform_leads WHERE \"studioId\" = 'demo-studio-project';"
```

### **2. Para Inserción de Datos**

**✅ Usar SQL Directo:**
```bash
# Insertar lead
source .env.local
psql $DATABASE_URL -c "INSERT INTO platform_leads (id, name, email, phone, \"studioName\", \"studioSlug\", \"studioId\", \"lastContactDate\", \"interestedPlan\", \"monthlyBudget\", \"probableStartDate\", \"agentId\", score, priority, \"conversionDate\", \"createdAt\", \"updatedAt\") VALUES ('demo-studio-lead-' || extract(epoch from now())::text, 'Juan Carlos Pérez', 'juan.perez@demo-studio.com', '+52 55 1234 5678', 'Demo Studio Pro', 'demo-studio', 'demo-studio-project', NOW(), 'Professional', 50000, NOW() + INTERVAL '30 days', NULL, 85, 'high', NOW(), NOW(), NOW());"
```

### **3. Para Operaciones Complejas**

**✅ Usar TypeScript con Cliente Singleton:**
```typescript
// scripts/operacion-compleja.ts
import { prisma } from '../src/lib/prisma';

async function operacionCompleja() {
  try {
    // Operaciones complejas con transacciones
    const resultado = await prisma.$transaction(async (tx) => {
      const proyecto = await tx.projects.findUnique({
        where: { slug: 'demo-studio' }
      });
      
      const lead = await tx.platform_leads.create({
        data: {
          name: 'Juan Carlos Pérez',
          email: 'juan.perez@demo-studio.com',
          studioId: proyecto.id,
          // ... otros campos
        }
      });
      
      return { proyecto, lead };
    });
    
    console.log('Resultado:', resultado);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

operacionCompleja();
```

---

## 📁 **ESTRUCTURA DE SCRIPTS RECOMENDADA**

```
scripts/
├── sql/                          # Scripts SQL directos
│   ├── verificar-datos.sql
│   ├── insertar-demo-data.sql
│   └── limpiar-datos.sql
├── ts/                           # Scripts TypeScript
│   ├── verificar-datos.ts
│   ├── operacion-compleja.ts
│   └── migracion-datos.ts
└── js/                           # Scripts JavaScript (solo si es necesario)
    ├── verificar-datos.js
    └── operacion-simple.js
```

---

## 🚨 **ANTI-PATRONES A EVITAR**

### **❌ NO Hacer:**

1. **Crear múltiples instancias** de PrismaClient
2. **No liberar conexiones** con `$disconnect()`
3. **Ejecutar scripts** sin cargar variables de entorno
4. **Usar JavaScript** para operaciones complejas
5. **Ignorar errores** de conexión

### **✅ Sí Hacer:**

1. **Usar SQL directo** para operaciones simples
2. **Usar TypeScript** para operaciones complejas
3. **Cargar variables** de entorno antes de ejecutar
4. **Liberar conexiones** correctamente
5. **Manejar errores** apropiadamente

---

## 🔧 **COMANDOS ÚTILES**

### **Verificación Rápida:**
```bash
# Cargar entorno
source .env.local

# Verificar conexión
psql $DATABASE_URL -c "SELECT 1;"

# Verificar proyecto
psql $DATABASE_URL -c "SELECT id, name, slug FROM projects WHERE slug = 'demo-studio';"
```

### **Inserción de Datos:**
```bash
# Insertar datos de prueba
psql $DATABASE_URL -f scripts/sql/insertar-demo-data.sql

# Verificar inserción
psql $DATABASE_URL -c "SELECT * FROM platform_leads WHERE \"studioId\" = 'demo-studio-project';"
```

### **Limpieza de Datos:**
```bash
# Limpiar datos de prueba
psql $DATABASE_URL -c "DELETE FROM platform_leads WHERE \"studioId\" = 'demo-studio-project';"
```

---

## 📚 **EJEMPLOS DE REFERENCIA**

### **Script SQL para Verificación:**
```sql
-- scripts/sql/verificar-demo-studio.sql
SELECT 
    p.id, 
    p.name, 
    p.slug, 
    p.email 
FROM projects p
WHERE p.slug = 'demo-studio';

SELECT 
    pl.id, 
    pl.name, 
    pl.email, 
    pl."studioId" 
FROM platform_leads pl
WHERE pl."studioId" = (SELECT id FROM projects WHERE slug = 'demo-studio');
```

### **Script TypeScript para Operación Compleja:**
```typescript
// scripts/ts/crear-demo-completo.ts
import { prisma } from '../src/lib/prisma';

async function crearDemoCompleto() {
  try {
    const resultado = await prisma.$transaction(async (tx) => {
      // Verificar proyecto
      const proyecto = await tx.projects.findUnique({
        where: { slug: 'demo-studio' }
      });

      if (!proyecto) {
        throw new Error('Proyecto no encontrado');
      }

      // Verificar si ya existe lead
      const leadExistente = await tx.platform_leads.findFirst({
        where: { studioId: proyecto.id }
      });

      if (leadExistente) {
        console.log('Lead ya existe:', leadExistente.name);
        return leadExistente;
      }

      // Crear lead
      const nuevoLead = await tx.platform_leads.create({
        data: {
          name: 'Juan Carlos Pérez',
          email: 'juan.perez@demo-studio.com',
          phone: '+52 55 1234 5678',
          studioName: 'Demo Studio Pro',
          studioSlug: 'demo-studio',
          studioId: proyecto.id,
          lastContactDate: new Date(),
          interestedPlan: 'Professional',
          monthlyBudget: 50000,
          probableStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          score: 85,
          priority: 'high',
          conversionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      return nuevoLead;
    });

    console.log('✅ Lead creado:', resultado);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearDemoCompleto();
```

---

## 🎯 **RESUMEN DE RECOMENDACIONES**

### **Para Operaciones Simples:**
1. **Usar SQL directo** con `psql`
2. **Cargar variables** de entorno con `source .env.local`
3. **Verificar resultados** inmediatamente

### **Para Operaciones Complejas:**
1. **Usar TypeScript** con cliente singleton
2. **Implementar transacciones** para consistencia
3. **Manejar errores** apropiadamente
4. **Liberar conexiones** con `$disconnect()`

### **Para Desarrollo:**
1. **Documentar** todos los scripts
2. **Versionar** cambios en la base de datos
3. **Probar** en entorno de desarrollo primero
4. **Mantener** scripts de limpieza

---

**💡 LECCIÓN APRENDIDA:** Los problemas de conexión con Prisma se resuelven mejor usando **SQL directo** para operaciones simples y **TypeScript con cliente singleton** para operaciones complejas. Evitar crear múltiples instancias de PrismaClient en scripts.
