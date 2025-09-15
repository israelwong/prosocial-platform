# 🔧 Configuración de Stripe - ProSocial Platform

## ⚠️ **Error Actual: STRIPE_SECRET_KEY is not set**

El error que estás viendo indica que las variables de entorno de Stripe no están configuradas.

## 🚀 **Solución: Configurar Variables de Entorno**

### **Paso 1: Crear archivo `.env.local`**

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# Stripe Configuration
# Para desarrollo, usa las claves de prueba (test keys) de Stripe
# Puedes obtenerlas en: https://dashboard.stripe.com/test/apikeys

# Clave secreta de Stripe (test key)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Clave pública de Stripe (test key) - para el frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Webhook secret para verificar eventos de Stripe
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration (si no están configuradas)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database
DATABASE_URL=your_database_url_here
```

### **Paso 2: Obtener Claves de Stripe**

1. **Ve a:** https://dashboard.stripe.com/test/apikeys
2. **Inicia sesión** en tu cuenta de Stripe
3. **Copia las claves:**
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### **Paso 3: Configurar Webhook (Opcional para desarrollo)**

1. **Ve a:** https://dashboard.stripe.com/test/webhooks
2. **Crea un nuevo webhook** con la URL: `http://localhost:3000/api/webhooks/stripe-subscriptions`
3. **Selecciona eventos:** `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. **Copia el webhook secret** → `STRIPE_WEBHOOK_SECRET`

### **Paso 4: Reiniciar el Servidor**

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia
npm run dev
```

## 🔑 **Claves de Prueba de Stripe**

Para desarrollo, puedes usar estas claves de prueba:

```bash
# Clave pública de prueba
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef...

# Clave secreta de prueba  
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
```

## 🧪 **Probar la Configuración**

Una vez configurado, puedes probar:

1. **Crear un plan** en `/admin/plans/new/edit`
2. **Agregar precios** (mensual/anual)
3. **Hacer clic en "Crear Precio en Stripe"**
4. **Verificar** que se creen los productos en Stripe Dashboard

## 🚨 **Solución Temporal**

Si no tienes acceso a Stripe ahora mismo, puedes:

### **Opción 1: Deshabilitar Stripe temporalmente**

Modifica `src/lib/stripe.ts` para que no falle:

```typescript
function getStripeInstance() {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn("⚠️ STRIPE_SECRET_KEY no configurado - Stripe deshabilitado");
        return null; // En lugar de throw error
    }
    // ... resto del código
}
```

### **Opción 2: Usar valores mock**

```bash
# En .env.local
STRIPE_SECRET_KEY=sk_test_mock_key_for_development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key_for_development
```

## 📋 **Checklist de Configuración**

- [ ] Archivo `.env.local` creado
- [ ] `STRIPE_SECRET_KEY` configurado
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado (opcional)
- [ ] Servidor reiniciado
- [ ] Plan creado exitosamente
- [ ] Precio creado en Stripe

## 🆘 **Solución de Problemas**

### **Error: "STRIPE_SECRET_KEY is not set"**
- ✅ Verifica que `.env.local` existe
- ✅ Verifica que la variable esté correctamente nombrada
- ✅ Reinicia el servidor

### **Error: "Invalid API Key"**
- ✅ Verifica que uses claves de prueba (sk_test_...)
- ✅ Verifica que la clave esté completa
- ✅ Verifica que no haya espacios extra

### **Error: "Webhook signature verification failed"**
- ✅ Verifica que `STRIPE_WEBHOOK_SECRET` esté correcto
- ✅ Verifica que la URL del webhook sea correcta

---

**Una vez configurado, el sistema de planes funcionará correctamente con Stripe! 🎉**
