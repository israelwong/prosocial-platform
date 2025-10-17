# 📦 Legacy Migrated

Este directorio contiene código legado que ha sido migrado a nuevas ubicaciones.

## Contenido

### `configuracion-old_catalogo/`
**Migrado desde:** `src/app/[slug]/studio/configuracion/catalogo/`  
**Migrado a:** `src/app/[slug]/studio/builder/catalogo/`

**Estado de migración:**
- ✅ Componentes replicados en builder
- ⚠️ Algunas rutas aún referencian esta ubicación antigua
- 🔄 En proceso de limpieza de referencias

**Referencias pendientes:**
- `src/lib/actions/studio/config/configuracion-precios.actions.ts` (líneas 251-252)
- `src/lib/actions/studio/config/paquetes.actions.ts` (línea 63, 117, 142, 237, 385)
- `src/lib/actions/studio/config/catalogo.actions.ts` (línea 36)
- `src/lib/actions/studio/negocio/tipos-evento.actions.ts` (línea 36)
- `src/lib/actions/studio/negocio/paquetes.actions.ts` (línea 38)

**Próximos pasos:**
1. Actualizar todos los `revalidatePath` para usar las nuevas rutas en `/builder/`
2. Actualizar enlaces en componentes que apunten a `/configuracion/catalogo/`
3. Una vez verificado que todo funciona, eliminar esta carpeta

---

**Fecha de movimiento:** 2024-10-17  
**Razón:** Reestructuración modular para centralizar gestión de catálogo en builder
