#!/bin/bash

echo "🔍 COMPARACIÓN: v2.2-foundation vs v2.2-configuracion-studio-identidad"
echo "======================================================================"
echo ""

WORKING="v2.2-foundation"
BROKEN="v2.2-configuracion-studio-identidad"

# 1. Diferencias en estructura app/configuracion
echo "1️⃣ CAMBIOS EN ESTRUCTURA DE CONFIGURACIÓN"
echo "=========================================="
echo ""

echo "📁 Archivos NUEVOS en branch roto:"
git diff --name-status $WORKING..$BROKEN -- "src/app/studio/[slug]/app/configuracion/" | grep "^A"

echo ""
echo "📝 Archivos RENOMBRADOS:"
git diff --name-status $WORKING..$BROKEN -- "src/app/studio/[slug]/app/configuracion/" | grep "^R"

echo ""
echo "✏️  Archivos MODIFICADOS:"
git diff --name-status $WORKING..$BROKEN -- "src/app/studio/[slug]/app/configuracion/" | grep "^M"

# 2. Buscar la ruta problemática específica
echo ""
echo "2️⃣ VERIFICAR RUTA PROBLEMÁTICA: cuentas-negocio"
echo "==============================================="
echo ""

echo "En v2.2-foundation:"
git checkout $WORKING 2>/dev/null
if [ -d "src/app/studio/[slug]/app/configuracion/pagos" ]; then
    find src/app/studio/\[slug\]/app/configuracion/pagos -type d | grep -E "metodo|cuenta" || echo "❌ No existe"
else
    echo "❌ Carpeta pagos no existe"
fi

echo ""
echo "En v2.2-configuracion-studio-identidad:"
git checkout $BROKEN 2>/dev/null
if [ -d "src/app/studio/[slug]/app/configuracion/pagos" ]; then
    find src/app/studio/\[slug\]/app/configuracion/pagos -type d | grep -E "metodo|cuenta"
else
    echo "❌ Carpeta pagos no existe"
fi

# 3. Comparar TODOS los paths largos
echo ""
echo "3️⃣ PATHS MÁS LARGOS EN CADA BRANCH"
echo "==================================="
echo ""

echo "Top 5 en v2.2-foundation:"
git checkout $WORKING 2>/dev/null
find src/app/studio/\[slug\]/app/configuracion -type d 2>/dev/null | awk '{print length, $0}' | sort -rn | head -5

echo ""
echo "Top 5 en v2.2-configuracion-studio-identidad:"
git checkout $BROKEN 2>/dev/null
find src/app/studio/\[slug\]/app/configuracion -type d 2>/dev/null | awk '{print length, $0}' | sort -rn | head -5

# 4. Diferencias en configuración
echo ""
echo "4️⃣ DIFERENCIAS EN ARCHIVOS DE CONFIGURACIÓN"
echo "==========================================="
echo ""

echo "📄 next.config.mjs:"
if git diff $WORKING..$BROKEN next.config.mjs | grep -q .; then
    echo "⚠️  HAY CAMBIOS:"
    git diff $WORKING..$BROKEN next.config.mjs
else
    echo "✅ Sin cambios"
fi

echo ""
echo "📄 middleware.ts:"
if git diff $WORKING..$BROKEN src/middleware.ts | grep -q .; then
    echo "⚠️  HAY CAMBIOS:"
    git diff $WORKING..$BROKEN src/middleware.ts | head -50
else
    echo "✅ Sin cambios"
fi

# 5. Commits entre branches
echo ""
echo "5️⃣ COMMITS DESDE v2.2-foundation"
echo "================================="
git log $WORKING..$BROKEN --oneline --graph -- "src/app/studio/[slug]/app/configuracion/"

echo ""
echo "======================================================================"
echo "✅ Análisis completo"

# Volver al branch roto
git checkout $BROKEN 2>/dev/null
