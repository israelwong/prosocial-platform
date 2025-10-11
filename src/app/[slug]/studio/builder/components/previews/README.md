# Sistema de Preview Estandarizado

## 🏗️ Arquitectura Modular

El sistema de preview está diseñado para ser **reutilizable** y **consistente** en todas las secciones del builder.

### **📱 MobilePreviewContainer**

Componente base que maneja automáticamente:

- ✅ **Header fijo** (sticky con blur)
- ✅ **Footer fijo** con datos reales
- ✅ **Layout responsivo** (375x812px)
- ✅ **Scroll automático** del contenido

### **🎯 Uso Estandarizado**

```tsx
// ✅ CORRECTO - Uso estandarizado
export function MiSeccionPreview({ data, loading = false }) {
  return (
    <MobilePreviewContainer data={data} loading={loading}>
      {/* Solo el contenido específico de la sección */}
      <NavbarPreview activeSection="mi-seccion" />
      <MiContenidoPreview data={data} />
    </MobilePreviewContainer>
  );
}
```

### **⚙️ Opciones de Configuración**

```tsx
<MobilePreviewContainer
  data={data}
  loading={loading}
  showHeader={true} // Por defecto: true
  showFooter={true} // Por defecto: true
>
  {/* Contenido */}
</MobilePreviewContainer>
```

### **🔧 Componentes Disponibles**

#### **Globales (Automáticos)**

- `HeaderPreview` - Logo, nombre, slogan
- `FooterPreview` - Web, redes, teléfono, dirección

#### **Específicos por Sección**

- `NavbarPreview` - Navegación
- `ContactoSectionPreview` - Datos de contacto
- `ContentPreviewSkeleton` - Contenido genérico

### **📊 Flujo de Datos**

```
SectionLayout → SectionPreview → MobilePreviewContainer
     ↓              ↓                    ↓
  data/loading → data/loading → HeaderPreview + FooterPreview
```

### **🎨 Beneficios**

1. **Consistencia**: Mismo header/footer en todas las secciones
2. **Mantenibilidad**: Cambios centralizados en `MobilePreviewContainer`
3. **Reutilización**: No duplicar código de header/footer
4. **Performance**: Datos cargados una sola vez
5. **UX**: Experiencia uniforme en todas las secciones

### **🚀 Implementación**

Para crear una nueva sección de preview:

1. **Crear el componente específico**:

```tsx
export function MiSeccionPreview({ data, loading }) {
  return (
    <MobilePreviewContainer data={data} loading={loading}>
      <NavbarPreview activeSection="mi-seccion" />
      <MiContenidoPreview data={data} />
    </MobilePreviewContainer>
  );
}
```

2. **Exportar en `index.ts`**:

```tsx
export { MiSeccionPreview } from "./MiSeccionPreview";
```

3. **Usar en `SectionPreview.tsx`**:

```tsx
case 'mi-seccion':
    return <MiSeccionPreview data={data} loading={loading} />;
```

**¡Listo!** 🎉 El header y footer se cargan automáticamente con datos reales.
