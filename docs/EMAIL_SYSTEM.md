# Sistema de Emails - ProSocial Platform

## 📧 **Stack Tecnológico**

### **Resend + React Email**

- ✅ **Resend**: Servicio de envío de emails transaccionales
- ✅ **React Email**: Templates en React con componentes reutilizables
- ✅ **Deliverability**: Excelente tasa de entrega
- ✅ **Developer Experience**: API moderna y fácil de usar

## 🏗️ **Arquitectura del Sistema**

### **Estructura de Archivos**

```
src/
├── emails/
│   ├── components/
│   │   └── EmailLayout.tsx          # Layout base para emails
│   └── templates/
│       └── AgentCredentialsEmail.tsx # Template de credenciales
├── lib/
│   └── email/
│       ├── resend-client.ts         # Cliente de Resend
│       └── agent-email-service.ts   # Servicio de emails para agentes
```

### **Flujo de Envío**

1. **API Route** llama al servicio de email
2. **Email Service** renderiza el template de React
3. **Resend Client** envía el email
4. **Response** incluye ID del email y estado

## 🎨 **Templates Disponibles**

### **1. Agent Credentials Email**

**Archivo**: `src/emails/templates/AgentCredentialsEmail.tsx`

#### **Props:**

```typescript
interface AgentCredentialsEmailProps {
  agentName: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
  isNewAgent?: boolean;
}
```

#### **Características:**

- ✅ **Branding ProSocial**: Logo oficial en header
- ✅ **Responsive Design**: Funciona en móvil y desktop
- ✅ **Credenciales Destacadas**: Box especial con datos de acceso
- ✅ **Botón CTA**: "Acceder a mi Panel"
- ✅ **Instrucciones Claras**: Warnings y pasos a seguir
- ✅ **Versión Texto**: Plain text alternativo

## 🔧 **Configuración**

### **Variables de Entorno Requeridas**

```bash
# Resend API Key (obtener en https://resend.com)
RESEND_API_KEY="re_your_api_key_here"

# Configuración de remitente
RESEND_FROM_EMAIL="ProSocial Platform <noreply@prosocialmx.com>"
RESEND_REPLY_TO="soporte@prosocialmx.com"

# URL base de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **Setup de Resend**

1. **Crear cuenta** en [resend.com](https://resend.com)
2. **Verificar dominio** prosocialmx.com
3. **Obtener API key** del dashboard
4. **Configurar DNS** para deliverability

## 🚀 **Uso del Sistema**

### **Enviar Credenciales a Agente**

```typescript
import { sendAgentCredentialsEmail } from "@/lib/email/agent-email-service";

const result = await sendAgentCredentialsEmail({
  agentName: "Juan Pérez",
  email: "juan@ejemplo.com",
  temporaryPassword: "Agente7x8k2m9p!",
  isNewAgent: true,
});

if (result.success) {
  console.log("Email enviado:", result.emailId);
} else {
  console.error("Error:", result.error);
}
```

### **Validar Configuración**

```typescript
import { validateEmailConfig } from "@/lib/email/agent-email-service";

const { isValid, errors } = validateEmailConfig();
if (!isValid) {
  console.error("Configuración inválida:", errors);
}
```

## 📊 **APIs Integradas**

### **1. POST /api/admin/agents**

- ✅ **Crea agente** en BD y Supabase Auth
- ✅ **Envía email** de bienvenida con credenciales
- ✅ **Response** incluye `emailSent` y `emailId`

### **2. POST /api/admin/agents/[id]/resend-credentials**

- ✅ **Genera nueva contraseña** temporal
- ✅ **Envía email** con credenciales actualizadas
- ✅ **Response** incluye `emailSent` y `emailId`

## 🎯 **Casos de Uso**

### **1. Nuevo Agente**

```
Admin crea agente → API genera credenciales → Email de bienvenida
```

### **2. Reenvío de Credenciales**

```
Admin reenvía credenciales → API genera nueva contraseña → Email de actualización
```

### **3. Reset de Contraseña (Futuro)**

```
Agente olvida contraseña → Solicita reset → Email con link de reset
```

## 📱 **Experiencia de Usuario**

### **Email de Bienvenida**

- 🎉 **Título**: "¡Bienvenido a ProSocial Platform!"
- 📝 **Contenido**: Credenciales + instrucciones
- 🎨 **Diseño**: Professional con branding

### **Email de Actualización**

- 🔑 **Título**: "Credenciales Actualizadas"
- 📝 **Contenido**: Nuevas credenciales + recordatorios
- 🎨 **Diseño**: Consistente con bienvenida

## 🔒 **Seguridad**

### **Mejores Prácticas**

- ✅ **Contraseñas temporales**: Deben cambiarse en primer login
- ✅ **Links seguros**: HTTPS en producción
- ✅ **No logging**: Contraseñas no se guardan en logs
- ✅ **Rate limiting**: Prevenir spam de emails

### **Datos Sensibles**

- 🔒 **En desarrollo**: Contraseña visible en response
- 🔒 **En producción**: Solo confirmación de envío
- 🔒 **Logs**: Solo IDs de email, no contenido

## 📈 **Monitoreo**

### **Métricas de Resend**

- ✅ **Delivered**: Emails entregados exitosamente
- ✅ **Bounced**: Emails rebotados
- ✅ **Opened**: Emails abiertos por usuarios
- ✅ **Clicked**: Links clickeados

### **Logs de Aplicación**

```typescript
console.log("✅ Email sent successfully:", result.data?.id);
console.error("❌ Error sending email:", error);
```

## 🚀 **Próximas Funcionalidades**

### **Templates Adicionales**

1. **Password Reset**: Link para cambiar contraseña
2. **Lead Notifications**: Notificar nuevos leads
3. **Weekly Reports**: Reportes semanales de performance
4. **Welcome Suscriptor**: Bienvenida para suscriptores

### **Mejoras Técnicas**

1. **Email Queue**: Queue system para envíos masivos
2. **Templates Editor**: Editor visual de templates
3. **A/B Testing**: Testing de subject lines
4. **Webhooks**: Tracking de eventos de email

## 🛠️ **Desarrollo Local**

### **Preview de Templates**

```bash
# Instalar React Email CLI
npm install -g react-email

# Iniciar preview server
react-email preview
```

### **Testing**

```typescript
// Test email service
import { sendAgentCredentialsEmail } from "@/lib/email/agent-email-service";

// En modo test, usar email de prueba
const result = await sendAgentCredentialsEmail({
  agentName: "Test User",
  email: "test@resend.dev", // Email especial de Resend para testing
  temporaryPassword: "TestPass123!",
  isNewAgent: true,
});
```

## 📚 **Referencias**

### **Documentación Oficial**

- [Resend Docs](https://resend.com/docs)
- [React Email Docs](https://react.email/docs)
- [Resend + Next.js Guide](https://resend.com/docs/send-with-nextjs)

### **Ejemplos de Templates**

- [React Email Examples](https://react.email/examples)
- [Resend Template Gallery](https://resend.com/templates)

---

**Última actualización:** Diciembre 2024  
**Mantenido por:** Equipo de Desarrollo ProSocial Platform
