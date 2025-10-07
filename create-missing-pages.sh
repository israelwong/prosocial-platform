#!/bin/bash

echo "🔧 CREANDO PÁGINAS FALTANTES - ZEN Pro"
echo "====================================="
echo ""

# Función para crear page.tsx simple
create_page() {
    local dir="$1"
    local name="$2"
    
    if [ ! -f "$dir/page.tsx" ]; then
        echo "Creando page.tsx en: $dir"
        cat > "$dir/page.tsx" << EOF
import React from 'react';

export default function ${name}Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">${name}</h1>
      <p className="text-zinc-400">
        Esta página está en desarrollo. Próximamente estará disponible.
      </p>
    </div>
  );
}
EOF
        echo "✅ Creado: $dir/page.tsx"
    else
        echo "⚠️  Ya existe: $dir/page.tsx"
    fi
}

echo "1️⃣ Creando páginas para carpetas principales..."

# Carpetas principales que necesitan page.tsx
create_page "src/app/studio/[slug]/app/configuracion/studio" "Studio"
create_page "src/app/studio/[slug]/app/configuracion/ventas" "Ventas"
create_page "src/app/studio/[slug]/app/configuracion/operacion" "Operación"
create_page "src/app/studio/[slug]/app/configuracion/sistema" "Sistema"
create_page "src/app/studio/[slug]/app/configuracion/pagina" "Página"
create_page "src/app/studio/[slug]/app/configuracion/cuenta" "Cuenta"
create_page "src/app/studio/[slug]/app/configuracion/catalogo" "Catálogo"
create_page "src/app/studio/[slug]/app/configuracion/integraciones" "Integraciones"
create_page "src/app/studio/[slug]/app/configuracion/pagos" "Pagos"
create_page "src/app/studio/[slug]/app/configuracion/analytics" "Analytics"

echo ""
echo "2️⃣ Creando páginas para subcarpetas específicas..."

# Subcarpetas específicas
create_page "src/app/studio/[slug]/app/configuracion/ventas/disponibilidad" "Disponibilidad"
create_page "src/app/studio/[slug]/app/configuracion/ventas/contratos" "Contratos"
create_page "src/app/studio/[slug]/app/configuracion/ventas/etapas-crm" "Etapas CRM"
create_page "src/app/studio/[slug]/app/configuracion/sistema/permisos" "Permisos"
create_page "src/app/studio/[slug]/app/configuracion/sistema/logs" "Logs"
create_page "src/app/studio/[slug]/app/configuracion/sistema/backups" "Backups"
create_page "src/app/studio/[slug]/app/configuracion/pagina/lead-forms" "Lead Forms"
create_page "src/app/studio/[slug]/app/configuracion/pagina/editor" "Editor"
create_page "src/app/studio/[slug]/app/configuracion/integraciones/apis" "APIs"
create_page "src/app/studio/[slug]/app/configuracion/integraciones/conectores" "Conectores"
create_page "src/app/studio/[slug]/app/configuracion/integraciones/webhooks" "Webhooks"
create_page "src/app/studio/[slug]/app/configuracion/pagos/cuentas-bancarias" "Cuentas Bancarias"
create_page "src/app/studio/[slug]/app/configuracion/pagos/metodos" "Métodos de Pago"
create_page "src/app/studio/[slug]/app/configuracion/pagos/stripe" "Stripe"
create_page "src/app/studio/[slug]/app/configuracion/analytics/reportes" "Reportes"
create_page "src/app/studio/[slug]/app/configuracion/analytics/dashboard" "Dashboard Analytics"
create_page "src/app/studio/[slug]/app/configuracion/analytics/metricas" "Métricas"

echo ""
echo "3️⃣ Creando página para operacion/pipeline/etapas..."
create_page "src/app/studio/[slug]/app/configuracion/operacion/pipeline/etapas" "Etapas Pipeline"

echo ""
echo "================================"
echo "✅ Páginas creadas exitosamente"
echo ""
echo "Nota: Las carpetas 'components' no necesitan page.tsx"
echo "ya que son carpetas de componentes, no rutas."
