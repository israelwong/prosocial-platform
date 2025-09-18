# 🚀 Plan de Refactorización - Sistema de Leads y Descuentos

## 📋 **RESUMEN EJECUTIVO**

Este plan de refactorización implementa mejoras significativas al sistema de leads y agrega un sistema completo de descuentos, **sin perder datos existentes**.

### **✅ GARANTÍAS DE SEGURIDAD**

- **NO se perderán datos** - Todas las modificaciones son aditivas
- **Rollback posible** - Cada cambio es reversible
- **Backup automático** - Se crea backup antes de cada migración
- **Validación completa** - Scripts de verificación en cada paso

---

## **🎯 CAMBIOS IMPLEMENTADOS**

### **1. Mejoras al Modelo de Leads**

- ✅ **Nuevos campos** para mejor clasificación
- ✅ **Seguimiento de conversión** por agente
- ✅ **Métricas de interacción** con leads
- ✅ **Tracking de UTM** para campañas

### **2. Sistema de Pipelines Separados**

- ✅ **Pipeline de Conversión** - Para prospectos
- ✅ **Pipeline de Soporte** - Para clientes con problemas
- ✅ **Etapas personalizables** por tipo de pipeline

### **3. Sistema Completo de Descuentos**

- ✅ **Códigos de descuento generales** (Black Friday, etc.)
- ✅ **Códigos personalizados por agente** (DEMO10_LEAD123)
- ✅ **Integración con Stripe** para aplicar descuentos
- ✅ **Tracking de uso** y métricas de conversión

---

## **⚡ COMANDOS DE EJECUCIÓN**

### **Opción 1: Migración Automática (Recomendada)**

```bash
# Ejecutar migración completa
./scripts/execute-migration.sh
```

### **Opción 2: Migración Manual Paso a Paso**

#### **Paso 1: Backup de Seguridad**

```bash
# Crear backup de la base de datos
pg_dump $DATABASE_URL > backup_pre_migration_$(date +%Y%m%d_%H%M%S).sql
```

#### **Paso 2: Aplicar Migraciones SQL**

```bash
# Aplicar migraciones en orden
psql $DATABASE_URL -f prisma/migrations/001_enhance_leads_model.sql
psql $DATABASE_URL -f prisma/migrations/002_pipeline_types.sql
psql $DATABASE_URL -f prisma/migrations/003_discount_system.sql
```

#### **Paso 3: Actualizar Prisma**

```bash
# Sincronizar schema con la base de datos
npx prisma db pull --force
npx prisma generate
```

#### **Paso 4: Ejecutar Seeds**

```bash
# Ejecutar migración completa con seeds
node scripts/run-complete-migration.js
```

#### **Paso 5: Validar Migración**

```bash
# Verificar que todo funciona correctamente
node scripts/validate-migration.js
```

---

## **🔧 COMANDOS DE DESARROLLO**

### **Para Desarrollo Local**

```bash
# Usar prisma db push para desarrollo
npx prisma db push
npx prisma generate
```

### **Para Producción**

```bash
# Usar migraciones SQL para producción
psql $DATABASE_URL -f prisma/migrations/001_enhance_leads_model.sql
psql $DATABASE_URL -f prisma/migrations/002_pipeline_types.sql
psql $DATABASE_URL -f prisma/migrations/003_discount_system.sql
npx prisma db pull --force
npx prisma generate
```

---

## **📊 NUEVOS MODELOS DE DATOS**

### **Campos Agregados a `platform_leads`**

```sql
tipo_lead                     VARCHAR(20) DEFAULT 'prospecto'
metodo_conversion             VARCHAR(20)
agente_conversion_id          VARCHAR(255)
fecha_primera_interaccion     TIMESTAMP
numero_interacciones          INTEGER DEFAULT 0
fuente_original               VARCHAR(100)
utm_source                    VARCHAR(100)
utm_medium                    VARCHAR(100)
utm_campaign                  VARCHAR(100)
```

### **Nuevos Modelos Creados**

- `platform_pipeline_types` - Tipos de pipeline (conversión, soporte)
- `platform_discount_codes` - Códigos de descuento generales
- `platform_discount_usage` - Registro de uso de descuentos
- `platform_agent_discount_codes` - Códigos personalizados por agente

---

## **🎯 CASOS DE USO IMPLEMENTADOS**

### **1. Lead Agenda Demo**

```
1. Lead llena formulario → Se crea en CRM
2. Agente genera código: "DEMO10_LEAD123"
3. Agente comparte URL: "prosocial.com/suscribirse?codigo=DEMO10_LEAD123"
4. Lead se suscribe con 10% descuento permanente
5. Sistema registra conversión del agente
```

### **2. Descuentos Generales**

```
1. Admin crea código: "BLACKFRIDAY2024" (15% descuento)
2. Se aplica automáticamente en checkout
3. Sistema trackea uso y conversiones
4. Reportes de efectividad del descuento
```

### **3. Pipelines Separados**

```
- Pipeline Conversión: Nuevos Leads → En Seguimiento → Demo → Suscritos
- Pipeline Soporte: Solicitud → En Análisis → Resuelto
```

---

## **📈 REPORTES DISPONIBLES**

### **Reportes de Conversión por Agente**

```sql
SELECT
  a.nombre as agente,
  COUNT(l.id) as leads_asignados,
  COUNT(CASE WHEN l.studioId IS NOT NULL THEN 1 END) as convertidos,
  ROUND(COUNT(CASE WHEN l.studioId IS NOT NULL THEN 1 END) * 100.0 / COUNT(l.id), 2) as tasa_conversion
FROM platform_agents a
LEFT JOIN platform_leads l ON a.id = l.agente_conversion_id
GROUP BY a.id, a.nombre;
```

### **Reportes de Descuentos**

```sql
SELECT
  dc.codigo,
  dc.valor_descuento,
  COUNT(du.id) as veces_usado,
  SUM(du.monto_descuento) as descuento_total_aplicado
FROM platform_discount_codes dc
LEFT JOIN platform_discount_usage du ON dc.id = du.discount_code_id
GROUP BY dc.id, dc.codigo, dc.valor_descuento;
```

---

## **⚠️ CONSIDERACIONES IMPORTANTES**

### **Antes de Ejecutar**

1. **Backup obligatorio** - Siempre crear backup antes de migrar
2. **Entorno de prueba** - Probar primero en desarrollo
3. **Ventana de mantenimiento** - Planificar tiempo de inactividad
4. **Rollback plan** - Tener plan de reversión listo

### **Después de Ejecutar**

1. **Validar funcionalidad** - Probar todas las características nuevas
2. **Verificar reportes** - Confirmar que los datos se muestran correctamente
3. **Capacitar equipo** - Entrenar en nuevas funcionalidades
4. **Monitorear performance** - Verificar que no hay impacto en rendimiento

---

## **🔄 ROLLBACK (Si es Necesario)**

### **Reversar Cambios**

```bash
# Restaurar backup
psql $DATABASE_URL < backup_pre_migration_YYYYMMDD_HHMMSS.sql

# Regenerar cliente de Prisma
npx prisma generate
```

### **Verificar Rollback**

```bash
# Validar que todo volvió al estado anterior
node scripts/validate-migration.js
```

---

## **📞 SOPORTE**

### **En Caso de Problemas**

1. **Revisar logs** - Verificar output de los scripts
2. **Validar conexión** - Confirmar DATABASE_URL
3. **Verificar permisos** - Asegurar acceso a base de datos
4. **Contactar equipo** - Si persisten los problemas

### **Logs Importantes**

- `scripts/run-complete-migration.js` - Logs de migración
- `scripts/validate-migration.js` - Logs de validación
- `execute-migration.sh` - Logs del script principal

---

## **✅ CHECKLIST POST-MIGRACIÓN**

- [ ] Backup creado y verificado
- [ ] Migraciones SQL aplicadas
- [ ] Schema de Prisma actualizado
- [ ] Cliente de Prisma regenerado
- [ ] Seeds ejecutados correctamente
- [ ] Validación completada sin errores
- [ ] Aplicación compila correctamente
- [ ] Panel de administración funciona
- [ ] Pipelines se muestran correctamente
- [ ] Sistema de descuentos operativo
- [ ] Reportes generan datos correctos
- [ ] Equipo capacitado en nuevas funcionalidades

---

**🎉 ¡Migración completada exitosamente!**

_Este documento se actualiza con cada versión del sistema._
