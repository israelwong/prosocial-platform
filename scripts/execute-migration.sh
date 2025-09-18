#!/bin/bash

# Script de ejecución completa de migración
# Fecha: 2024-09-18
# Descripción: Ejecuta la migración completa del sistema de manera segura

set -e  # Salir si cualquier comando falla

echo "🚀 Iniciando migración completa del sistema ProSocial"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Verificar que .env.local existe
if [ ! -f ".env.local" ]; then
    error "No se encontró .env.local. Asegúrate de tener la configuración de base de datos."
    exit 1
fi

# Paso 1: Backup de seguridad
log "Paso 1: Creando backup de seguridad..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_pre_migration_${TIMESTAMP}.sql"

if command -v pg_dump &> /dev/null; then
    log "Creando backup con pg_dump..."
    pg_dump $DATABASE_URL > $BACKUP_FILE
    success "Backup creado: $BACKUP_FILE"
else
    warning "pg_dump no está disponible. Crea un backup manualmente antes de continuar."
    read -p "¿Continuar sin backup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Paso 2: Verificar conexión a base de datos
log "Paso 2: Verificando conexión a base de datos..."
if npx prisma db pull --force > /dev/null 2>&1; then
    success "Conexión a base de datos verificada"
else
    error "No se pudo conectar a la base de datos. Verifica tu DATABASE_URL."
    exit 1
fi

# Paso 3: Aplicar migraciones SQL
log "Paso 3: Aplicando migraciones SQL..."

MIGRATION_FILES=(
    "prisma/migrations/001_enhance_leads_model.sql"
    "prisma/migrations/002_pipeline_types.sql"
    "prisma/migrations/003_discount_system.sql"
)

for migration_file in "${MIGRATION_FILES[@]}"; do
    if [ -f "$migration_file" ]; then
        log "Aplicando: $migration_file"
        if command -v psql &> /dev/null; then
            psql $DATABASE_URL -f "$migration_file"
            success "Migración aplicada: $migration_file"
        else
            warning "psql no está disponible. Aplica manualmente: $migration_file"
        fi
    else
        warning "Archivo de migración no encontrado: $migration_file"
    fi
done

# Paso 4: Actualizar schema de Prisma
log "Paso 4: Actualizando schema de Prisma..."
npx prisma db pull --force
success "Schema de Prisma actualizado"

# Paso 5: Generar cliente de Prisma
log "Paso 5: Generando cliente de Prisma..."
npx prisma generate
success "Cliente de Prisma generado"

# Paso 6: Ejecutar migración con Node.js
log "Paso 6: Ejecutando migración con Node.js..."
node scripts/run-complete-migration.js
success "Migración de Node.js completada"

# Paso 7: Validar migración
log "Paso 7: Validando migración..."
node scripts/validate-migration.js
success "Validación completada"

# Paso 8: Verificar que la aplicación funciona
log "Paso 8: Verificando que la aplicación funciona..."
if npm run build > /dev/null 2>&1; then
    success "Aplicación compila correctamente"
else
    error "La aplicación no compila. Revisa los errores."
    exit 1
fi

echo ""
echo "🎉 ¡Migración completada exitosamente!"
echo "======================================"
echo ""
echo "📊 Resumen de cambios:"
echo "   ✅ Campos adicionales en platform_leads"
echo "   ✅ Sistema de pipelines separados"
echo "   ✅ Sistema completo de descuentos"
echo "   ✅ Códigos de descuento de agentes"
echo "   ✅ Datos de seed iniciales"
echo ""
echo "🔗 Próximos pasos:"
echo "   1. Reinicia la aplicación"
echo "   2. Verifica el panel de administración"
echo "   3. Prueba la funcionalidad de descuentos"
echo "   4. Configura los pipelines en la UI"
echo ""
echo "📁 Backup disponible en: $BACKUP_FILE"
echo ""
success "¡Migración completada!"
