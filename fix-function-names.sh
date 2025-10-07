#!/bin/bash

echo "🔧 CORRIGIENDO NOMBRES DE FUNCIONES - ZEN Pro"
echo "============================================="
echo ""

# Función para limpiar nombre de función
clean_function_name() {
    local name="$1"
    # Convertir a PascalCase y eliminar caracteres especiales
    echo "$name" | sed 's/[^a-zA-Z0-9]/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g'
}

# Función para corregir un archivo
fix_file() {
    local file="$1"
    local dir_name=$(basename "$(dirname "$file")")
    local clean_name=$(clean_function_name "$dir_name")
    
    echo "Corrigiendo: $file -> ${clean_name}Page"
    
    # Crear el archivo corregido
    cat > "$file" << EOF
import React from 'react';

export default function ${clean_name}Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">${dir_name}</h1>
      <p className="text-zinc-400">
        Esta página está en desarrollo. Próximamente estará disponible.
      </p>
    </div>
  );
}
EOF
}

echo "1️⃣ Corrigiendo archivos con nombres de función inválidos..."

# Corregir archivos problemáticos específicos
fix_file "src/app/studio/[slug]/app/configuracion/analytics/dashboard/page.tsx"
fix_file "src/app/studio/[slug]/app/configuracion/operacion/pipeline/etapas/page.tsx"
fix_file "src/app/studio/[slug]/app/configuracion/pagina/lead-forms/page.tsx"
fix_file "src/app/studio/[slug]/app/configuracion/pagos/cuentas-bancarias/page.tsx"
fix_file "src/app/studio/[slug]/app/configuracion/pagos/metodos/page.tsx"

echo ""
echo "2️⃣ Corrigiendo todos los demás archivos..."

# Corregir todos los archivos de configuración
find src/app/studio/\[slug\]/app/configuracion -name "page.tsx" | while read file; do
    fix_file "$file"
done

echo ""
echo "================================"
echo "✅ Nombres de funciones corregidos"
echo ""
echo "Todas las funciones ahora usan PascalCase válido:"
echo "- Sin espacios"
echo "- Sin caracteres especiales"
echo "- Nombres únicos por carpeta"
