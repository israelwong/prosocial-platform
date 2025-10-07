#!/bin/bash

echo "🔍 DIAGNÓSTICO DE RUTAS - ZEN Pro"
echo "================================"
echo ""

# 1. Build limpio
echo "1️⃣ Limpiando build anterior..."
rm -rf .next
npm run build > build-full.log 2>&1

# 2. Extraer routes manifest
echo "2️⃣ Extrayendo routes manifest..."
if [ -f .next/routes-manifest.json ]; then
    cat .next/routes-manifest.json | jq '.' > routes-manifest-readable.json
    echo "✅ Routes manifest extraído"
else
    echo "❌ No se encontró routes-manifest.json"
fi

# 3. Buscar caracteres no-ASCII en nombres de archivo
echo ""
echo "3️⃣ Buscando caracteres especiales en paths..."
find src/app -type f -o -type d | LC_ALL=C grep -v '^[[:print:]]*$' > non-ascii-paths.txt
if [ -s non-ascii-paths.txt ]; then
    echo "⚠️  Caracteres no-ASCII encontrados:"
    cat non-ascii-paths.txt
else
    echo "✅ No se encontraron caracteres no-ASCII"
fi

# 4. Listar todas las rutas generadas
echo ""
echo "4️⃣ Rutas generadas por Next.js:"
find .next/server/app -name "*.js" -o -name "*.html" | sed 's/.next\/server\/app//' | sort > generated-routes.txt
head -50 generated-routes.txt

# 5. Buscar rutas con patrones problemáticos
echo ""
echo "5️⃣ Buscando patrones problemáticos..."
echo ""
echo "Rutas con múltiples guiones:"
grep -E ".*-.*-.*-" generated-routes.txt

echo ""
echo "Rutas con caracteres especiales:"
grep -E "[^a-zA-Z0-9_/\[\]\.\-]" generated-routes.txt

# 6. Verificar middleware
echo ""
echo "6️⃣ Verificando middleware matcher..."
if [ -f src/middleware.ts ]; then
    echo "Matcher encontrado:"
    grep -A 20 "matcher:" src/middleware.ts
fi

# 7. Verificar next.config
echo ""
echo "7️⃣ Verificando next.config..."
if [ -f next.config.mjs ]; then
    cat next.config.mjs
fi

echo ""
echo "================================"
echo "✅ Diagnóstico completo"
echo "Revisa los archivos generados:"
echo "  - build-full.log"
echo "  - routes-manifest-readable.json"
echo "  - generated-routes.txt"
echo "  - non-ascii-paths.txt"
