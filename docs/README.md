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
- **ARQUITECTURA_HIBRIDA_RPC_REST.md** - **NUEVA** Arquitectura híbrida RPC/REST
- **ESTRUCTURA_SERVER_ACTIONS.md** - **NUEVA** Estructura de Server Actions por roles

### 🛠️ **02-implementation/** - Guías de Implementación

- **KANBAN_IMPLEMENTATION_GUIDE.md** - Guía completa del Kanban
- **NESTED_DRAG_DROP_GUIDE.md** - Guía de implementación de drag & drop anidado
- **SIMPLE_DRAG_DROP_GUIDE.md** - Guía de implementación de drag & drop simple
- **IMPLEMENTATION_STATUS.md** - Estado actual de implementación
- **LIMPIEZA_COMPLETADA.md** - Resumen de limpieza de código
- **SUPABASE_TROUBLESHOOTING.md** - Guía de solución de problemas de Supabase
- **GUIA_MIGRACION_API_REST.md** - **NUEVA** Guía de migración API REST → Server Actions
- **GUIA_IMPLEMENTACION_PASO_A_PASO.md** - **NUEVA** Guía de implementación paso a paso
- **CONFIGURACION_PRECIOS_SOBREPRECIO.md** - **NUEVA** Documentación del sobreprecio para descuentos
- **MIGRACION_ZEN_PRO_DOMAIN.md** - **NUEVA** Plan de migración completo a dominio zen.pro

### 🔧 **03-troubleshooting/** - Solución de Problemas

- **README.md** - Índice de troubleshooting
- **supabase-common-errors.md** - Errores comunes de Supabase
- **supabase-permissions-leads.md** - Problemas de permisos con leads

### 📋 **04-best-practices/** - Mejores Prácticas

- **REGLA_CONSULTA_DOCUMENTACION_OBLIGATORIA.md** - **🚨 CRÍTICO** Regla de consulta obligatoria de documentación
- **MEJORES_PRACTICAS_COMPONENTES.md** - Mejores prácticas para componentes
- **PATRON_CREACION_SECCIONES_ADMIN.md** - Patrón para crear secciones admin
- **TYPESCRIPT_BEST_PRACTICES.md** - Mejores prácticas de TypeScript
- **UI_DESIGN_PATTERNS.md** - Patrones de diseño UI reutilizables
- **SISTEMA_LEADS_DESCUENTOS_IMPLEMENTADO.md** - Sistema de leads y descuentos implementado
- **METODOLOGIA_DESARROLLO_SECCIONES.md** - Metodología automatizada para desarrollo de secciones
- **COMANDOS_AUTOMATIZACION.md** - Comandos para automatización de desarrollo
- **REGLAS_AGENTE_AUTOMATIZACION.md** - Reglas específicas para el agente IA
- **AUTOMATIZACION_GIT_AVANZADA.md** - Automatización avanzada con gestión de ramas Git
- **PLAN_CONSISTENCIA_DISENO.md** - **NUEVA** Plan de consistencia de diseño ProSocial
- **AUDITORIA_COMPONENTES.md** - **NUEVA** Auditoría detallada de componentes existentes
- **MCP_ZEN_WORKFLOW.md** - **NUEVA** Flujo de trabajo MCP + ZEN Design System

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
- **AI_CONTEXT_SISTEMA_LEADS_DESCUENTOS.md** - Contexto para agente IA sobre sistema de leads y descuentos

---

## 📋 **DOCUMENTOS PRINCIPALES**

### 🚀 **Para Desarrolladores**

1. **[🚨 REGLA CRÍTICA: Consulta Obligatoria](./04-best-practices/REGLA_CONSULTA_DOCUMENTACION_OBLIGATORIA.md)** - **OBLIGATORIO** Leer antes de implementar
2. **[Arquitectura Híbrida RPC/REST](./01-architecture/ARQUITECTURA_HIBRIDA_RPC_REST.md)** - **NUEVA** Arquitectura principal del proyecto
3. **[Estructura de Server Actions](./01-architecture/ESTRUCTURA_SERVER_ACTIONS.md)** - **NUEVA** Organización por roles
4. **[Guía de Migración API REST](./02-implementation/GUIA_MIGRACION_API_REST.md)** - **NUEVA** Migración paso a paso
5. **[Guía de Implementación](./02-implementation/GUIA_IMPLEMENTACION_PASO_A_PASO.md)** - **NUEVA** Implementación detallada
6. **[Migración a zen.pro](./02-implementation/MIGRACION_ZEN_PRO_DOMAIN.md)** - **NUEVA** Plan completo de migración de dominio
7. **[Arquitectura de Roles](./01-architecture/ARQUITECTURA_ROLES.md)** - Entender el sistema de permisos
8. **[Guía de Kanban](./02-implementation/KANBAN_IMPLEMENTATION_GUIDE.md)** - Implementación del CRM
9. **[Drag & Drop Anidado](./02-implementation/NESTED_DRAG_DROP_GUIDE.md)** - Implementación de reordenamiento anidado
10. **[Drag & Drop Simple](./02-implementation/SIMPLE_DRAG_DROP_GUIDE.md)** - Implementación de reordenamiento simple
11. **[Mejores Prácticas](./04-best-practices/MEJORES_PRACTICAS_COMPONENTES.md)** - Estándares de código
12. **[Patrones de Diseño UI](./04-best-practices/UI_DESIGN_PATTERNS.md)** - Patrones reutilizables para interfaces
13. **[Plan de Consistencia de Diseño](./04-best-practices/PLAN_CONSISTENCIA_DISENO.md)** - **NUEVA** Plan para unificar el diseño entre admin, agente y studio
14. **[Auditoría de Componentes](./04-best-practices/AUDITORIA_COMPONENTES.md)** - **NUEVA** Análisis detallado de inconsistencias actuales
15. **[Metodología de Desarrollo](./04-best-practices/METODOLOGIA_DESARROLLO_SECCIONES.md)** - Metodología automatizada para secciones
16. **[Comandos de Automatización](./04-best-practices/COMANDOS_AUTOMATIZACION.md)** - Comandos para desarrollo automatizado
17. **[Automatización Git Avanzada](./04-best-practices/AUTOMATIZACION_GIT_AVANZADA.md)** - Gestión automática de ramas Git
18. **[Flujo MCP + ZEN](./04-best-practices/MCP_ZEN_WORKFLOW.md)** - **NUEVA** Integración MCP con ZEN Design System

### 🔧 **Para Troubleshooting**

1. **[Errores Comunes de Supabase](./03-troubleshooting/supabase-common-errors.md)**
2. **[Problemas de Permisos](./03-troubleshooting/supabase-permissions-leads.md)**

### 📚 **Para Referencia**

1. **[Configuración de Stripe](./06-reference/STRIPE_SETUP.md)**
2. **[Sistema de Suscripciones](./06-reference/SISTEMA_SUSCRIPCIONES.md)**
3. **[Sistema de Leads y Descuentos](./04-best-practices/SISTEMA_LEADS_DESCUENTOS_IMPLEMENTADO.md)** - Sistema implementado
4. **[Contexto para Agente IA](./06-reference/AI_CONTEXT_SISTEMA_LEADS_DESCUENTOS.md)** - Información crítica para IA

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

## 🚨 **REGLA CRÍTICA - CONSULTA OBLIGATORIA**

### ⚠️ **ANTES DE CUALQUIER IMPLEMENTACIÓN:**

**SIEMPRE consultar la documentación en este orden:**

1. 📋 **`/docs/04-best-practices/`** - Para patrones establecidos
2. 🔧 **`/docs/02-implementation/`** - Para guías específicas
3. 🚨 **`/docs/03-troubleshooting/`** - Para problemas conocidos

**📖 Ver:** [REGLA_CONSULTA_DOCUMENTACION_OBLIGATORIA.md](./04-best-practices/REGLA_CONSULTA_DOCUMENTACION_OBLIGATORIA.md)

---

## 🚨 **NOTAS IMPORTANTES**

- **Este es un proyecto en desarrollo** - La documentación evoluciona constantemente
- **Siempre verificar** la información antes de implementar
- **Reportar** discrepancias entre código y documentación
- **Mantener** este índice actualizado

---

**Última actualización**: $(date)
**Versión**: 1.0.0
