# Scripts de Configuración de Planes y Servicios

Este conjunto de scripts está diseñado para configurar completamente el sistema de planes y servicios de ProSocial basado en el Plan Estratégico y Comercial.

## 📋 Scripts Disponibles

### 1. `setup-plans-and-services.js` (Script Maestro)

**Recomendado para uso general**

Ejecuta todo el proceso de configuración en el orden correcto:

- Limpia y recrea categorías y servicios
- Limpia y recrea planes con precios
- Configura todas las relaciones plan-servicio

```bash
node scripts/setup-plans-and-services.js
```

### 2. `cleanup-and-recreate-services.js`

**Solo para recrear servicios**

Limpia y recrea las categorías y servicios basados en la tabla del plan estratégico.

```bash
node scripts/cleanup-and-recreate-services.js
```

### 3. `cleanup-and-recreate-plans.js`

**Solo para recrear planes**

Limpia y recrea los planes con los precios y configuraciones definidos.

```bash
node scripts/cleanup-and-recreate-plans.js
```

## 🎯 Configuración de Planes

### Plan Personal (El Organizador)

- **Precio mensual**: $399
- **Precio anual**: $3,999
- **Usuarios**: 1
- **Eventos activos**: Hasta 5 por mes
- **Paquetes**: Hasta 5 preconfigurados

### Plan Pro (El Estandarizador) - ⭐ Popular

- **Precio mensual**: $599
- **Precio anual**: $5,999
- **Usuarios**: Hasta 5
- **Eventos activos**: Ilimitados
- **Paquetes**: Ilimitados

### Plan Premium (El Escalador)

- **Precio mensual**: $999
- **Precio anual**: $9,999
- **Usuarios**: 10+
- **Eventos activos**: Ilimitados
- **Paquetes**: Ilimitados

## 🏗️ Estructura de Categorías y Servicios

### 1. LÍMITES CLAVE

- Usuarios del sistema
- Eventos activos por mes
- Paquetes preconfigurados

### 2. COMERCIAL Y VENTAS

- Portafolio (Landing Page)
- CRM y Gestión de Contactos
- Pipeline (Kanban)
- Recordatorios por Email
- Recordatorios por WhatsApp

### 3. PORTAL DE COTIZACIÓN

- Presentación de cotizaciones
- Pasarela de pago
- Comparador dinámico

### 4. GESTIÓN Y FINANZAS

- Gestión de Eventos
- Calendario de Eventos
- Gestión de Catálogos
- Dashboard Financiero
- Métricas de Rendimiento
- Cálculo de Rentabilidad

### 5. PERSONALIZACIÓN Y EQUIPO

- Portal de Cliente
- Personalización Avanzada (Marca Blanca)
- Gestión de Personal y Roles
- Parámetros de Utilidad/Comisión

### 6. INTEGRACIONES

- Stripe (Pasarela de Pago)
- ManyChat (API Key)

## ⚠️ Advertencias Importantes

### ⚠️ **DESTRUCTIVO**

Estos scripts **ELIMINAN** todos los datos existentes de:

- Categorías de servicios
- Servicios de la plataforma
- Planes existentes
- Relaciones plan-servicio

### 🔒 **Backup Recomendado**

Antes de ejecutar, asegúrate de:

1. Hacer backup de la base de datos
2. Verificar que no hay datos críticos que se puedan perder
3. Ejecutar en un entorno de desarrollo primero

### 🚫 **No Ejecutar en Producción**

Estos scripts están diseñados para configuración inicial o reset completo. No ejecutar en producción sin backup.

## 🔄 Flujo de Ejecución

1. **Limpieza**: Elimina todas las relaciones y datos existentes
2. **Recreación**: Crea nuevas categorías y servicios basados en la tabla
3. **Configuración**: Crea planes con precios y características
4. **Relaciones**: Establece relaciones plan-servicio según la tabla
5. **Verificación**: Muestra resumen de lo creado

## 📊 Verificación Post-Ejecución

Después de ejecutar los scripts, verifica:

1. **Panel de Administración**: Revisa que los planes aparezcan correctamente
2. **Precios**: Confirma que los precios mensuales y anuales sean correctos
3. **Servicios**: Verifica que cada plan tenga los servicios correctos activados
4. **Límites**: Confirma que los límites estén configurados correctamente

## 🛠️ Troubleshooting

### Error de Conexión a Base de Datos

```bash
# Verificar que .env.local esté configurado correctamente
cat .env.local | grep DATABASE_URL
```

### Error de Permisos

```bash
# Asegurar que el script tenga permisos de ejecución
chmod +x scripts/setup-plans-and-services.js
```

### Error de Dependencias

```bash
# Instalar dependencias si es necesario
npm install
```

## 📝 Logs y Output

Los scripts proporcionan output detallado incluyendo:

- ✅ Operaciones exitosas
- ⚠️ Advertencias
- ❌ Errores
- 📊 Resúmenes de configuración

## 🔗 Próximos Pasos

Después de ejecutar los scripts:

1. **Stripe**: Configurar productos y precios en Stripe
2. **Testing**: Probar funcionalidad de suscripciones
3. **UI**: Verificar que la interfaz muestre los planes correctamente
4. **Documentación**: Actualizar documentación de la plataforma
