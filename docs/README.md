# 📚 ProSocial Platform - Documentación

## 🎯 **ÍNDICE DE DOCUMENTACIÓN**

Esta documentación está organizada por categorías para facilitar la navegación y el mantenimiento iterativo del conocimiento.

---

## 📁 **ESTRUCTURA DE DOCUMENTACIÓN**

### 🏗️ **01-architecture/** - Arquitectura y Diseño
- **ARQUITECTURA_ROLES.md** - Sistema de roles y permisos
- **BRANDING_ASSETS.md** - Assets de marca y diseño
- **RELACIONES_DIAGRAM.md** - Diagramas de relaciones de base de datos
- **SCHEMA_ANALYSIS.md** - Análisis del esquema de Prisma

### 🛠️ **02-implementation/** - Guías de Implementación
- **KANBAN_IMPLEMENTATION_GUIDE.md** - Guía completa del Kanban
- **IMPLEMENTATION_STATUS.md** - Estado actual de implementación
- **LIMPIEZA_COMPLETADA.md** - Resumen de limpieza de código
- **SUPABASE_TROUBLESHOOTING.md** - Guía de solución de problemas de Supabase

### 🔧 **03-troubleshooting/** - Solución de Problemas
- **README.md** - Índice de troubleshooting
- **supabase-common-errors.md** - Errores comunes de Supabase
- **supabase-permissions-leads.md** - Problemas de permisos con leads

### 📋 **04-best-practices/** - Mejores Prácticas
- **MEJORES_PRACTICAS_COMPONENTES.md** - Mejores prácticas para componentes
- **PATRON_CREACION_SECCIONES_ADMIN.md** - Patrón para crear secciones admin

### 🗂️ **05-legacy/** - Código Legacy y Migración
- **ANALISIS_LEGACY.md** - Análisis del código legacy
- **COMPONENTES_A_COPIAR.md** - Componentes legacy a migrar

### 📖 **06-reference/** - Referencias y APIs
- **CREAR_USUARIOS_SUPABASE.md** - Guía para crear usuarios
- **CREDENCIALES_ACCESO.md** - Credenciales de acceso
- **EMAIL_SYSTEM.md** - Sistema de emails
- **STRIPE_SETUP.md** - Configuración de Stripe
- **SISTEMA_AGENTES_AUTH.md** - Sistema de autenticación de agentes
- **SISTEMA_EMAILS_AGENTES.md** - Sistema de emails para agentes
- **SISTEMA_SUSCRIPCIONES.md** - Sistema de suscripciones
- **SOLUCION_MODELOS_PRISMA.md** - Solución de modelos de Prisma

---

## 📋 **DOCUMENTOS PRINCIPALES**

### 🚀 **Para Desarrolladores**
1. **[Arquitectura de Roles](./01-architecture/ARQUITECTURA_ROLES.md)** - Entender el sistema de permisos
2. **[Guía de Kanban](./02-implementation/KANBAN_IMPLEMENTATION_GUIDE.md)** - Implementación del CRM
3. **[Mejores Prácticas](./04-best-practices/MEJORES_PRACTICAS_COMPONENTES.md)** - Estándares de código

### 🔧 **Para Troubleshooting**
1. **[Errores Comunes de Supabase](./03-troubleshooting/supabase-common-errors.md)**
2. **[Problemas de Permisos](./03-troubleshooting/supabase-permissions-leads.md)**

### 📚 **Para Referencia**
1. **[Configuración de Stripe](./06-reference/STRIPE_SETUP.md)**
2. **[Sistema de Suscripciones](./06-reference/SISTEMA_SUSCRIPCIONES.md)**

---

## 🎯 **PRINCIPIOS DE DOCUMENTACIÓN**

### ✅ **Reglas de Calidad**
1. **Nunca usar `any`** - Tipado fuerte en TypeScript
2. **Documentación viva** - Actualizar con cada cambio
3. **Ejemplos prácticos** - Incluir código de ejemplo
4. **Navegación clara** - Enlaces entre documentos relacionados

### 🔄 **Mantenimiento Iterativo**
- **Actualizar** documentación con cada feature
- **Revisar** mensualmente la relevancia
- **Eliminar** documentación obsoleta
- **Consolidar** información duplicada

---

## 📝 **CÓMO CONTRIBUIR**

### 📖 **Al Agregar Nueva Documentación**
1. **Categorizar** en la estructura apropiada
2. **Actualizar** este README.md
3. **Incluir** ejemplos de código
4. **Validar** que la información sea precisa

### 🔧 **Al Modificar Código**
1. **Actualizar** documentación relacionada
2. **Verificar** que los ejemplos funcionen
3. **Mantener** consistencia con el estilo

---

## 🚨 **NOTAS IMPORTANTES**

- **Este es un proyecto en desarrollo** - La documentación evoluciona constantemente
- **Siempre verificar** la información antes de implementar
- **Reportar** discrepancias entre código y documentación
- **Mantener** este índice actualizado

---

**Última actualización**: $(date)
**Versión**: 1.0.0