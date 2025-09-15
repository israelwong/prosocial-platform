# ProSocial Platform - Recursos de Branding

## 🎨 **Identidad Visual**

### **Logotipos Oficiales**

#### **Isotipo (Símbolo)**

```
URL: https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg
Formato: SVG
Uso: Favicon, iconos de aplicación, elementos pequeños
Dimensiones recomendadas: 48x48px, 32x32px, 16x16px
```

#### **Logotipo Completo**

```
URL: https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/logotipo.svg
Formato: SVG
Contenido: "PROSOCIALMX"
Uso: Headers, páginas de login, documentos oficiales
Dimensiones recomendadas: 160x32px (proporción 5:1)
```

## 🔧 **Implementación Técnica**

### **Favicon Configuration**

```typescript
// En src/app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
    shortcut:
      "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
    apple:
      "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
  },
};
```

### **Componente de Header de Autenticación**

```typescript
// En src/components/auth-header.tsx
<Image
  src="https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg"
  alt="ProSocial Platform"
  width={48}
  height={48}
  className="w-12 h-12"
/>
<Image
  src="https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/logotipo.svg"
  alt="ProSocial MX"
  width={160}
  height={32}
  className="h-8 w-auto"
/>
```

## 🎯 **Guías de Uso**

### **Isotipo (Símbolo)**

- ✅ **Usar para**: Favicons, iconos de app, elementos UI pequeños
- ✅ **Tamaños**: 16px, 32px, 48px, 64px
- ✅ **Contextos**: Navegadores, aplicaciones móviles, notificaciones

### **Logotipo Completo**

- ✅ **Usar para**: Headers principales, páginas de login, documentación
- ✅ **Tamaños**: Mínimo 120px de ancho
- ✅ **Contextos**: Páginas web, emails, documentos oficiales

### **Combinación (Isotipo + Logotipo)**

- ✅ **Usar para**: Headers de autenticación, páginas principales
- ✅ **Espaciado**: 8px entre isotipo y logotipo
- ✅ **Alineación**: Centrado verticalmente

## 📱 **Responsive Design**

### **Mobile (< 768px)**

```css
.logo-isotipo {
  width: 40px;
  height: 40px;
}
.logo-logotipo {
  height: 24px;
  width: auto;
}
```

### **Tablet (768px - 1024px)**

```css
.logo-isotipo {
  width: 48px;
  height: 48px;
}
.logo-logotipo {
  height: 32px;
  width: auto;
}
```

### **Desktop (> 1024px)**

```css
.logo-isotipo {
  width: 56px;
  height: 56px;
}
.logo-logotipo {
  height: 36px;
  width: auto;
}
```

## 🌙 **Soporte para Dark/Light Mode**

Los logos en formato SVG se adaptan automáticamente al tema:

- **Light Mode**: Elementos oscuros sobre fondo claro
- **Dark Mode**: Elementos claros sobre fondo oscuro

## 📦 **Archivos de Referencia**

### **Implementados en:**

- `src/app/layout.tsx` - Favicon y metadata
- `src/components/auth-header.tsx` - Header de autenticación
- `src/app/auth/login/page.tsx` - Página de login
- `src/app/auth/complete-profile/page.tsx` - Página de completar perfil

### **Para Futuras Implementaciones:**

- Headers de admin/agente dashboards
- Emails transaccionales
- Documentación PDF
- Presentaciones comerciales

## 🔒 **Consideraciones de Seguridad**

- Los assets están hospedados en Supabase Storage
- URLs públicas y accesibles
- Formato SVG optimizado para web
- Sin dependencias externas críticas

## 🚀 **Próximos Pasos**

1. **Crear versiones PNG/WebP** para contextos que no soporten SVG
2. **Definir paleta de colores** oficial de la marca
3. **Crear kit de prensa** con diferentes formatos y tamaños
4. **Documentar guidelines** de uso de marca más detallados

---

**Última actualización:** Diciembre 2024  
**Mantenido por:** Equipo de Desarrollo ProSocial Platform
