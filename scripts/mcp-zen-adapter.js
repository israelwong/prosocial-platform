#!/usr/bin/env node

/**
 * MCP ZEN Adapter
 * 
 * Script para automatizar la adaptación de componentes instalados
 * desde MCP a ZEN Design System
 */

const fs = require('fs');
const path = require('path');

// Mapeo de componentes shadcn a ZEN
const COMPONENT_MAPPING = {
  'button': 'ZenButton',
  'input': 'ZenInput', 
  'card': 'ZenCard',
  'textarea': 'ZenTextarea',
  'badge': 'ZenBadge',
  'label': 'ZenLabel'
};

// Mapeo de props shadcn a ZEN
const PROPS_MAPPING = {
  button: {
    'variant': {
      'default': 'primary',
      'destructive': 'destructive',
      'outline': 'outline',
      'secondary': 'secondary',
      'ghost': 'ghost'
    },
    'size': {
      'sm': 'sm',
      'default': 'md', 
      'lg': 'lg'
    }
  },
  input: {
    'type': 'type', // Mantener igual
    'placeholder': 'placeholder', // Mantener igual
    'disabled': 'disabled' // Mantener igual
  }
};

/**
 * Adapta un archivo de componente de shadcn a ZEN
 */
function adaptComponentToZen(filePath, componentName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Cambiar imports
    const zenComponent = COMPONENT_MAPPING[componentName.toLowerCase()];
    if (zenComponent) {
      // Reemplazar import de shadcn por ZEN
      content = content.replace(
        new RegExp(`import\\s*{\\s*${componentName}\\s*}\\s*from\\s*["']@/components/ui/shadcn/${componentName}["']`, 'g'),
        `import { ${zenComponent} } from "@/components/ui/zen"`
      );
      
      // 2. Reemplazar uso del componente
      const regex = new RegExp(`<${componentName}([^>]*)>`, 'g');
      content = content.replace(regex, (match, props) => {
        const adaptedProps = adaptProps(props, componentName);
        return `<${zenComponent}${adaptedProps}>`;
      });
      
      // 3. Reemplazar cierre del componente
      content = content.replace(
        new RegExp(`</${componentName}>`, 'g'),
        `</${zenComponent}>`
      );
    }
    
    // 4. Agregar imports de ZEN si no existen
    if (!content.includes('from "@/components/ui/zen"')) {
      const zenImports = extractZenImports(content);
      if (zenImports.length > 0) {
        const importStatement = `import { ${zenImports.join(', ')} } from "@/components/ui/zen";`;
        content = importStatement + '\n' + content;
      }
    }
    
    // 5. Escribir archivo adaptado
    fs.writeFileSync(filePath, content);
    console.log(`✅ Adaptado ${filePath} a ZEN Design System`);
    
  } catch (error) {
    console.error(`❌ Error adaptando ${filePath}:`, error.message);
  }
}

/**
 * Adapta las props de un componente
 */
function adaptProps(propsString, componentName) {
  const componentMapping = PROPS_MAPPING[componentName.toLowerCase()];
  if (!componentMapping) return propsString;
  
  let adaptedProps = propsString;
  
  // Adaptar variant
  if (componentMapping.variant) {
    Object.entries(componentMapping.variant).forEach(([shadcn, zen]) => {
      adaptedProps = adaptedProps.replace(
        new RegExp(`variant=["']${shadcn}["']`, 'g'),
        `variant="${zen}"`
      );
    });
  }
  
  // Adaptar size
  if (componentMapping.size) {
    Object.entries(componentMapping.size).forEach(([shadcn, zen]) => {
      adaptedProps = adaptedProps.replace(
        new RegExp(`size=["']${shadcn}["']`, 'g'),
        `size="${zen}"`
      );
    });
  }
  
  return adaptedProps;
}

/**
 * Extrae los imports de ZEN necesarios
 */
function extractZenImports(content) {
  const zenComponents = [];
  Object.values(COMPONENT_MAPPING).forEach(zenComponent => {
    if (content.includes(zenComponent)) {
      zenComponents.push(zenComponent);
    }
  });
  return zenComponents;
}

/**
 * Procesa un directorio recursivamente
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Detectar componentes shadcn en el archivo
      const content = fs.readFileSync(filePath, 'utf8');
      Object.keys(COMPONENT_MAPPING).forEach(componentName => {
        if (content.includes(componentName)) {
          adaptComponentToZen(filePath, componentName);
        }
      });
    }
  });
}

/**
 * Función principal
 */
function main() {
  const targetDir = process.argv[2] || './src';
  
  console.log('🚀 Iniciando adaptación MCP → ZEN...');
  console.log(`📁 Procesando directorio: ${targetDir}`);
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Directorio no encontrado: ${targetDir}`);
    process.exit(1);
  }
  
  processDirectory(targetDir);
  
  console.log('✅ Adaptación completada');
  console.log('📝 Revisa los archivos y ajusta manualmente si es necesario');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  adaptComponentToZen,
  processDirectory,
  COMPONENT_MAPPING,
  PROPS_MAPPING
};
