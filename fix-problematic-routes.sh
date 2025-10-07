#!/bin/bash

echo "🔧 RENOMBRANDO RUTAS PROBLEMÁTICAS - ZEN Pro"
echo "=========================================="
echo ""

# Función para renombrar directorios
rename_dir() {
    local old_path="$1"
    local new_path="$2"
    
    if [ -d "$old_path" ]; then
        echo "Renombrando: $old_path -> $new_path"
        mv "$old_path" "$new_path"
        echo "✅ Renombrado exitosamente"
    else
        echo "⚠️  No encontrado: $old_path"
    fi
}

echo "1️⃣ Renombrando rutas con guiones múltiples..."

# Lista de rutas problemáticas identificadas
rename_dir "src/app/studio/[slug]/app/configuracion/studio/redes-sociales" "src/app/studio/[slug]/app/configuracion/studio/redes"
rename_dir "src/app/studio/[slug]/app/configuracion/ventas/inteligencia-financiera" "src/app/studio/[slug]/app/configuracion/ventas/inteligencia"
rename_dir "src/app/studio/[slug]/app/configuracion/ventas/reglas-agendamiento" "src/app/studio/[slug]/app/configuracion/ventas/reglas"
rename_dir "src/app/studio/[slug]/app/configuracion/ventas/condiciones-comerciales" "src/app/studio/[slug]/app/configuracion/ventas/condiciones"
rename_dir "src/app/studio/[slug]/app/configuracion/operacion/tipos-evento" "src/app/studio/[slug]/app/configuracion/operacion/tipos"

echo ""
echo "2️⃣ Verificando que no queden rutas problemáticas..."
remaining_problematic=$(find src/app -name "*" -type d | grep -E ".*-.*" | wc -l)
echo "Rutas con guiones restantes: $remaining_problematic"

if [ "$remaining_problematic" -gt 0 ]; then
    echo "⚠️  Aún hay rutas problemáticas:"
    find src/app -name "*" -type d | grep -E ".*-.*"
else
    echo "✅ No hay más rutas problemáticas"
fi

echo ""
echo "3️⃣ Ejecutando build de prueba..."
npm run build > build-test.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso después de renombrar rutas"
else
    echo "❌ Build falló después de renombrar rutas"
    echo "Revisa build-test.log para más detalles"
fi

echo ""
echo "================================"
echo "✅ Proceso de renombrado completado"
