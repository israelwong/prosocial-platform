# Fix para Error de CUID en Pipeline Stages

## Problema
El error `Argument id is missing` ocurre porque los modelos `platform_*` en la base de datos no tienen `@default(cuid())` configurado, aunque el schema de Prisma sí lo tiene.

## Solución

### Opción 1: Usar el script automático (Recomendado)
```bash
# Cuando la conexión a Supabase se restablezca, ejecutar:
node scripts/apply-cuid-defaults.js
```

### Opción 2: Usar Prisma db push
```bash
# Cuando la conexión a Supabase se restablezca, ejecutar:
npx prisma db push
```

### Opción 3: Ejecutar SQL manualmente
Si las opciones anteriores fallan, ejecutar el SQL manualmente en Supabase:

```sql
-- Ver archivo: prisma/migrations/manual_add_cuid_defaults.sql
ALTER TABLE platform_pipeline_stages ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
-- ... (resto de statements)
```

## Verificación
Después de aplicar la solución, la creación de pipeline stages debería funcionar sin errores.

## Nota
PostgreSQL usa `gen_random_uuid()` en lugar de `cuid()` nativo, pero Prisma maneja la conversión automáticamente.
