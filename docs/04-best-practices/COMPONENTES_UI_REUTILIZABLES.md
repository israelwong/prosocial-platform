# Componentes UI Reutilizables

## 📁 **COMPONENTES CREADOS**

### **1. Dropzone (`src/components/ui/dropzone.tsx`)**

Componente reutilizable para drag & drop de archivos.

#### **Props**
```typescript
interface DropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: {
    [key: string]: string[];
  };
  maxSize?: number; // en MB
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

#### **Uso**
```tsx
<Dropzone
  onFileSelect={handleFileSelect}
  acceptedFileTypes={{
    'image/png': ['.png'],
    'image/svg+xml': ['.svg']
  }}
  maxSize={5}
  maxFiles={1}
  disabled={uploading}
>
  <div className="text-center">
    <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
    <p className="text-zinc-500 text-sm">Subir archivo</p>
  </div>
</Dropzone>
```

#### **Características**
- ✅ **Drag & Drop** funcional
- ✅ **Validación de tipos** de archivo
- ✅ **Validación de tamaño** máximo
- ✅ **Validación de cantidad** de archivos
- ✅ **Estados visuales** (drag active, disabled)
- ✅ **Manejo de errores** con mensajes descriptivos
- ✅ **Personalizable** con children

### **2. FilePreview (`src/components/ui/file-preview.tsx`)**

Componente para previsualizar archivos subidos.

#### **Props**
```typescript
interface FilePreviewProps {
  file: File | string; // File object o URL string
  onRemove?: () => void;
  onView?: () => void;
  className?: string;
  showActions?: boolean;
}
```

#### **Uso**
```tsx
<FilePreview
  file={fileUrl}
  onRemove={handleRemove}
  onView={() => window.open(fileUrl, '_blank')}
  showActions={true}
/>
```

#### **Características**
- ✅ **Soporte para File object y URL**
- ✅ **Previsualización de imágenes** (thumbnail)
- ✅ **Previsualización de videos** (con controles)
- ✅ **Iconos por tipo** de archivo
- ✅ **Información del archivo** (nombre, tamaño, tipo)
- ✅ **Acciones** (ver, eliminar)
- ✅ **Manejo de errores** de carga de imagen

## 🎯 **CASOS DE USO**

### **1. Logos e Isotipos**
```tsx
// Solo imágenes PNG/SVG
<Dropzone
  acceptedFileTypes={{
    'image/png': ['.png'],
    'image/svg+xml': ['.svg']
  }}
  maxSize={5}
  maxFiles={1}
/>
```

### **2. Galerías de Fotos**
```tsx
// Solo imágenes JPG
<Dropzone
  acceptedFileTypes={{
    'image/jpeg': ['.jpg', '.jpeg']
  }}
  maxSize={5}
  maxFiles={10}
/>
```

### **3. Videos**
```tsx
// Solo videos MP4
<Dropzone
  acceptedFileTypes={{
    'video/mp4': ['.mp4']
  }}
  maxSize={100}
  maxFiles={1}
/>
```

### **4. Documentos**
```tsx
// Solo PDFs
<Dropzone
  acceptedFileTypes={{
    'application/pdf': ['.pdf']
  }}
  maxSize={10}
  maxFiles={1}
/>
```

## 🔧 **INTEGRACIÓN CON SERVER ACTIONS**

### **Patrón de Uso**
```tsx
const { uploading, progress, error, uploadFile, deleteFile } = useFileUpload({
  studioSlug,
  category: 'identidad',
  subcategory: 'logos',
  allowedMimeTypes: ALLOWED_MIME_TYPES.image,
  maxSize: 5,
  onSuccess: (newUrl) => {
    onLocalUpdate(newUrl);
    onUpdate(newUrl);
  },
  onError: (error) => {
    toast.error(error);
  }
});

const handleFileSelect = async (file: File) => {
  // Validación
  if (!ALLOWED_MIME_TYPES.image.includes(file.type)) {
    toast.error('Tipo de archivo no permitido');
    return;
  }

  // Actualización optimista
  onLocalUpdate(URL.createObjectURL(file));

  try {
    const result = await uploadFile(file);
    if (result.success && result.publicUrl) {
      await onUpdate(result.publicUrl);
      toast.success('Archivo subido exitosamente');
    } else {
      onLocalUpdate(url || null);
      toast.error(result.error || 'Error al subir archivo');
    }
  } catch {
    onLocalUpdate(url || null);
    toast.error('Error al subir archivo');
  }
};
```

## 🎨 **ESTILOS Y TEMA**

### **Colores del Tema Zinc**
- **Fondo**: `bg-zinc-800`
- **Bordes**: `border-zinc-700`
- **Texto principal**: `text-zinc-300`
- **Texto secundario**: `text-zinc-500`
- **Texto deshabilitado**: `text-zinc-600`

### **Estados Visuales**
- **Drag Active**: `border-blue-500 bg-blue-500/10`
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Error**: `text-red-400`
- **Éxito**: `text-green-400`

## 📱 **RESPONSIVIDAD**

Los componentes están diseñados para ser responsivos:
- **Mobile**: Botones de tamaño completo
- **Desktop**: Botones compactos con iconos
- **Tablet**: Adaptación automática

## 🚀 **PRÓXIMAS MEJORAS**

### **Funcionalidades Futuras**
- [ ] **Compresión automática** de imágenes
- [ ] **Redimensionamiento** de imágenes
- [ ] **Filtros** de imagen básicos
- [ ] **Vista previa** de PDFs
- [ ] **Metadatos** de archivos
- [ ] **Historial** de archivos

### **Optimizaciones**
- [ ] **Lazy loading** de previsualizaciones
- [ ] **Cache** de URLs de archivos
- [ ] **Progressive loading** para imágenes grandes
- [ ] **WebP** support automático

## 📚 **EJEMPLOS COMPLETOS**

### **LogoManager Completo**
```tsx
export function LogoManager({ tipo, url, onUpdate, onLocalUpdate, studioSlug }: LogoManagerProps) {
  const { uploading, progress, error, uploadFile, deleteFile } = useFileUpload({
    studioSlug,
    category: 'identidad',
    subcategory: tipo === 'logo' ? 'logos' : 'isotipos',
    allowedMimeTypes: ALLOWED_MIME_TYPES.image,
    maxSize: 5,
    onSuccess: (newUrl) => {
      onLocalUpdate(newUrl);
      onUpdate(newUrl);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const handleFileSelect = async (file: File) => {
    // Validación y upload...
  };

  const handleRemoveUrl = async () => {
    onLocalUpdate(null);
    try {
      if (url) await deleteFile(url);
      await onUpdate('');
      toast.success('Archivo eliminado');
    } catch {
      onLocalUpdate(url || null);
      toast.error('Error al eliminar archivo');
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-3">
          <FilePreview
            file={url}
            onRemove={handleRemoveUrl}
            onView={() => window.open(url, '_blank')}
            showActions={true}
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar {titulo}
          </Button>
        </div>
      ) : (
        <Dropzone
          onFileSelect={handleFileSelect}
          acceptedFileTypes={{
            'image/png': ['.png'],
            'image/svg+xml': ['.svg']
          }}
          maxSize={5}
          maxFiles={1}
          disabled={uploading}
          className="h-32"
        >
          <div className="text-center">
            <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-zinc-500 text-sm">Subir {titulo}</p>
            <p className="text-zinc-600 text-xs mt-1">PNG, SVG (máx. 5MB)</p>
          </div>
        </Dropzone>
      )}

      {uploading && (
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
    </div>
  );
}
```

---

**¡Estos componentes están listos para ser reutilizados en toda la aplicación!** 🚀
