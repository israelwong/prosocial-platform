#!/bin/bash

# Script de build optimizado para Vercel
echo "🚀 Iniciando build para Vercel..."

# Limpiar cache
echo "🧹 Limpiando cache..."
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Generar Prisma
echo "🗄️ Generando Prisma Client..."
npx prisma generate

# Build con variables de entorno optimizadas
echo "🔨 Construyendo aplicación..."
NEXT_TELEMETRY_DISABLED=1 npm run build

echo "✅ Build completado exitosamente!"
