#!/bin/bash

# Script para actualizar imports de componentes UI después de reorganización
echo "🔄 Actualizando imports de componentes UI..."

# Función para actualizar imports
update_imports() {
    local component=$1
    echo "  Actualizando imports de $component..."
    
    # Buscar y reemplazar imports del componente
    find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
        "s|from '@/components/ui/$component'|from '@/components/ui/shadcn/$component'|g"
    
    # También actualizar imports con destructuring en múltiples líneas
    find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
        "s|} from '@/components/ui/$component'|} from '@/components/ui/shadcn/$component'|g"
}

# Lista de componentes a actualizar
components=(
    "button"
    "input" 
    "label"
    "textarea"
    "card"
    "dialog"
    "badge"
    "select"
    "checkbox"
    "switch"
    "avatar"
    "dropdown-menu"
    "popover"
    "alert-dialog"
    "alert"
    "separator"
    "table"
    "tabs"
    "calendar"
    "form"
    "loading-spinner"
    "modal"
    "header-navigation"
    "section-navigation"
    "logo"
    "theme-toggle"
    "sonner"
    "dropzone"
    "file-preview"
    "Skeleton"
    "SkeletonLogo"
)

# Actualizar cada componente
for component in "${components[@]}"; do
    update_imports "$component"
done

echo "✅ Imports actualizados correctamente"
echo ""
echo "🔍 Verificando algunos archivos..."

# Verificar algunos archivos
echo "Ejemplos de imports actualizados:"
grep -r "from '@/components/ui/shadcn/" src --include="*.tsx" --include="*.ts" | head -5

echo ""
echo "🚨 Verificar si quedan imports antiguos:"
remaining=$(grep -r "from '@/components/ui/[^s]" src --include="*.tsx" --include="*.ts" | grep -v "from '@/components/ui/shadcn/" | grep -v "from '@/components/ui/zen/" | wc -l)
echo "Imports antiguos restantes: $remaining"

if [ $remaining -gt 0 ]; then
    echo "❌ Aún hay imports antiguos que necesitan revisión:"
    grep -r "from '@/components/ui/[^s]" src --include="*.tsx" --include="*.ts" | grep -v "from '@/components/ui/shadcn/" | grep -v "from '@/components/ui/zen/" | head -10
else
    echo "✅ Todos los imports han sido actualizados"
fi
