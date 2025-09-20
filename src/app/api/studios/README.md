# APIs de Studios

Esta carpeta contiene todas las APIs específicas para la gestión de studios en la plataforma ProSocial.

## 🏗️ Estructura

```
studios/
├── [slug]/                    # Operaciones por studio específico
│   ├── route.ts              # CRUD básico del studio
│   ├── configuracion/        # Configuración del studio
│   │   ├── cuenta/          # Datos de cuenta
│   │   │   ├── identidad/route.ts
│   │   │   ├── contacto/route.ts
│   │   │   ├── horarios/route.ts
│   │   │   └── redes-sociales/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── negocio/route.ts
│   │   ├── personal/route.ts
│   │   └── integraciones/route.ts
│   ├── leads/               # Gestión de leads
│   ├── clientes/            # Gestión de clientes
│   ├── cotizaciones/        # Gestión de cotizaciones
│   └── analytics/           # Métricas del studio
└── route.ts                 # Lista de studios (para admin)
```

## 🔐 Autenticación

Todas las APIs utilizan el middleware `authenticateStudio` que:

- Verifica que el studio existe por slug
- Valida que el studio está activo
- (Futuro) Verifica permisos del usuario

```typescript
import { authenticateStudio } from "@/lib/studio-auth";

const authResult = await authenticateStudio(request, slug);
if (authResult.error) {
  return NextResponse.json(
    { error: authResult.error },
    { status: authResult.status }
  );
}
```

## 📝 Patrones de API

### GET - Obtener datos

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 1. Autenticar studio
  // 2. Obtener datos
  // 3. Retornar respuesta
}
```

### POST - Crear datos

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 1. Autenticar studio
  // 2. Validar datos
  // 3. Crear registro
  // 4. Retornar respuesta
}
```

### PUT - Actualizar datos

```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // 1. Autenticar studio
  // 2. Validar datos
  // 3. Actualizar registro
  // 4. Retornar respuesta
}
```

### DELETE - Eliminar datos

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  // 1. Autenticar studio
  // 2. Verificar existencia
  // 3. Eliminar registro
  // 4. Retornar respuesta
}
```

## 🎯 Endpoints Implementados

### Configuración de Cuenta

#### Identidad

- `GET /api/studios/[slug]/configuracion/cuenta/identidad`
- `PUT /api/studios/[slug]/configuracion/cuenta/identidad`

#### Redes Sociales

- `GET /api/studios/[slug]/configuracion/cuenta/redes-sociales`
- `POST /api/studios/[slug]/configuracion/cuenta/redes-sociales`
- `PUT /api/studios/[slug]/configuracion/cuenta/redes-sociales`
- `GET /api/studios/[slug]/configuracion/cuenta/redes-sociales/[id]`
- `PUT /api/studios/[slug]/configuracion/cuenta/redes-sociales/[id]`
- `DELETE /api/studios/[slug]/configuracion/cuenta/redes-sociales/[id]`

## 🔧 Helpers Disponibles

### `authenticateStudio(request, slug)`

Autentica y valida acceso al studio.

### `validateRequiredFields(data, requiredFields)`

Valida que los campos requeridos estén presentes.

### `validateUrl(url)`

Valida que una URL tenga formato válido.

## 📋 Próximos Pasos

1. **Implementar APIs faltantes**:
   - Contacto
   - Horarios
   - Negocio
   - Personal
   - Integraciones

2. **Agregar autenticación de usuarios**:
   - Verificar permisos por usuario
   - Roles y permisos granulares

3. **Implementar validaciones avanzadas**:
   - Validación de dominios por plataforma
   - Límites de caracteres
   - Sanitización de datos

4. **Agregar logging y monitoreo**:
   - Logs de operaciones
   - Métricas de uso
   - Alertas de errores

## 🚀 Uso en Frontend

```typescript
// Ejemplo de uso en el frontend
const response = await fetch(
  `/api/studios/${slug}/configuracion/cuenta/redes-sociales`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const redesSociales = await response.json();
```

## 🔒 Seguridad

- Todas las APIs validan la existencia del studio
- Validación de datos de entrada
- Sanitización de URLs
- Prevención de duplicados
- Transacciones para operaciones múltiples
