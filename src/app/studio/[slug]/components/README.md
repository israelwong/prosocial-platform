# Componentes Reutilizables del Studio

Esta carpeta contiene componentes reutilizables específicos para el área de studio que pueden ser utilizados en diferentes secciones.

## ConfirmModal

Modal de confirmación reutilizable para acciones destructivas o importantes.

### Uso

```tsx
import { ConfirmModal } from "@/app/studio/[slug]/components/ConfirmModal";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Realizar acción
      await deleteItem();
      setShowModal(false);
    } catch (error) {
      // Manejar error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Eliminar</Button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Eliminar elemento"
        description="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
        loading={loading}
      />
    </>
  );
}
```

### Props

| Prop          | Tipo                         | Requerido | Default         | Descripción                            |
| ------------- | ---------------------------- | --------- | --------------- | -------------------------------------- |
| `isOpen`      | `boolean`                    | ✅        | -               | Controla si el modal está abierto      |
| `onClose`     | `() => void`                 | ✅        | -               | Función llamada al cerrar el modal     |
| `onConfirm`   | `() => void`                 | ✅        | -               | Función llamada al confirmar la acción |
| `title`       | `string`                     | ✅        | -               | Título del modal                       |
| `description` | `string`                     | ✅        | -               | Descripción de la acción               |
| `confirmText` | `string`                     | ❌        | `'Confirmar'`   | Texto del botón de confirmación        |
| `cancelText`  | `string`                     | ❌        | `'Cancelar'`    | Texto del botón de cancelación         |
| `variant`     | `'default' \| 'destructive'` | ❌        | `'destructive'` | Variante visual del modal              |
| `loading`     | `boolean`                    | ❌        | `false`         | Estado de carga durante la acción      |

### Variantes

- **`destructive`**: Para acciones destructivas (eliminar, archivar, etc.)
  - Botón de confirmación rojo
  - Icono de advertencia
  - Colores de alerta

- **`default`**: Para acciones normales (guardar, publicar, etc.)
  - Botón de confirmación azul
  - Icono de advertencia
  - Colores neutros

### Características

- ✅ **Accesible**: Soporte completo para lectores de pantalla
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Loading state**: Muestra estado de carga durante acciones asíncronas
- ✅ **Keyboard navigation**: Soporte para navegación con teclado
- ✅ **Escape key**: Se cierra con la tecla Escape
- ✅ **Click outside**: Se cierra al hacer clic fuera del modal

### Casos de Uso

- Eliminar elementos (redes sociales, proyectos, etc.)
- Archivar contenido
- Publicar cambios importantes
- Confirmar acciones irreversibles
- Validar operaciones críticas

### Ejemplos de Implementación

#### Eliminar Red Social

```tsx
<ConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteConfirm}
  title="Eliminar red social"
  description={`¿Estás seguro de que quieres eliminar ${platformName}? Esta acción no se puede deshacer.`}
  confirmText="Eliminar"
  variant="destructive"
  loading={deleting}
/>
```

#### Publicar Proyecto

```tsx
<ConfirmModal
  isOpen={showPublishModal}
  onClose={() => setShowPublishModal(false)}
  onConfirm={handlePublishConfirm}
  title="Publicar proyecto"
  description="¿Estás seguro de que quieres publicar este proyecto? Será visible para todos los usuarios."
  confirmText="Publicar"
  variant="default"
  loading={publishing}
/>
```

## Estructura de Archivos

```
src/app/studio/[slug]/components/
├── ConfirmModal.tsx          # Modal de confirmación
├── index.ts                  # Exportaciones
└── README.md                 # Esta documentación
```

## Convenciones

- Todos los componentes deben ser funcionales con hooks
- Usar TypeScript con tipado estricto
- Seguir el tema oscuro (zinc) del proyecto
- Incluir soporte para estados de carga
- Ser accesibles y responsive
- Documentar props y casos de uso
