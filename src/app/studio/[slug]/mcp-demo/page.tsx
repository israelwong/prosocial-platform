"use client";

import { useState } from "react";
import { ZenButton, ZenInput, ZenCard, ZenCardHeader, ZenCardTitle, ZenCardContent, ZenCardDescription } from "@/components/ui/zen";
import { ZenTextarea } from "@/components/ui/zen/forms/ZenTextarea";
import {
  ZenSidebarProvider,
  ZenSidebar,
  ZenSidebarContent,
  ZenSidebarFooter,
  ZenSidebarGroup,
  ZenSidebarGroupContent,
  ZenSidebarGroupLabel,
  ZenSidebarHeader,
  ZenSidebarMenu,
  ZenSidebarMenuButton,
  ZenSidebarMenuItem,
  ZenSidebarTrigger,
  ZenSidebarOverlay,
} from "@/components/ui/zen";
import { Home, Settings, Users, BarChart3, FileText, HelpCircle } from "lucide-react";

/**
 * Página de demostración MCP + ZEN Design System
 * 
 * Esta página muestra la integración completa entre:
 * - MCP (Model Context Protocol) para instalación automática
 * - ZEN Design System para componentes unificados
 * - Tema oscuro zinc consistente
 */
// Componente del Sidebar
function AppSidebar() {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "#",
    },
    {
      title: "Usuarios",
      icon: Users,
      url: "#",
    },
    {
      title: "Reportes",
      icon: BarChart3,
      url: "#",
    },
    {
      title: "Documentos",
      icon: FileText,
      url: "#",
    },
    {
      title: "Configuración",
      icon: Settings,
      url: "#",
    },
  ];

  return (
    <ZenSidebar>
      <ZenSidebarHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-zinc-300 font-bold">Z</span>
          </div>
          <span className="font-semibold text-zinc-200">ZEN Design</span>
        </div>
      </ZenSidebarHeader>
      
      <ZenSidebarContent>
        <ZenSidebarGroup>
          <ZenSidebarGroupLabel>Navegación</ZenSidebarGroupLabel>
          <ZenSidebarGroupContent>
            <ZenSidebarMenu>
              {menuItems.map((item) => (
                <ZenSidebarMenuItem key={item.title}>
                  <ZenSidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </ZenSidebarMenuButton>
                </ZenSidebarMenuItem>
              ))}
            </ZenSidebarMenu>
          </ZenSidebarGroupContent>
        </ZenSidebarGroup>
      </ZenSidebarContent>
      
      <ZenSidebarFooter>
        <ZenSidebarMenu>
          <ZenSidebarMenuItem>
            <ZenSidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                <span>Ayuda</span>
              </a>
            </ZenSidebarMenuButton>
          </ZenSidebarMenuItem>
        </ZenSidebarMenu>
      </ZenSidebarFooter>
    </ZenSidebar>
  );
}

export default function MCPDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    category: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    alert("¡Formulario enviado con éxito! (Demo)");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ZenSidebarProvider>
      <div className="flex min-h-screen bg-zinc-950">
        <AppSidebar />
        <ZenSidebarOverlay />
        
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <ZenSidebarTrigger />
            <h1 className="text-2xl font-bold text-white">MCP + ZEN Demo</h1>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            MCP + ZEN Design System Demo
          </h2>
          <p className="text-zinc-400 text-lg">
            Demostración de la integración entre MCP (Model Context Protocol) y ZEN Design System
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Formulario de Contacto */}
          <ZenCard variant="default" padding="lg">
            <ZenCardHeader>
              <ZenCardTitle>Formulario de Contacto</ZenCardTitle>
              <ZenCardDescription>
                Formulario creado con componentes ZEN instalados via MCP
              </ZenCardDescription>
            </ZenCardHeader>
            <ZenCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ZenInput
                  label="Nombre Completo"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  hint="Tu nombre completo"
                />
                
                <ZenInput
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  hint="Tu dirección de email"
                />
                
                <ZenInput
                  label="Categoría"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  hint="Selecciona una categoría"
                />
                
                <ZenTextarea
                  label="Mensaje"
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  error={errors.message}
                  hint="Describe tu consulta"
                  minRows={4}
                />
                
                <div className="flex gap-3">
                  <ZenButton
                    type="submit"
                    variant="primary"
                    loading={loading}
                    loadingText="Enviando..."
                    className="flex-1"
                  >
                    Enviar Mensaje
                  </ZenButton>
                  
                  <ZenButton
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ name: "", email: "", message: "", category: "" })}
                    disabled={loading}
                  >
                    Limpiar
                  </ZenButton>
                </div>
              </form>
            </ZenCardContent>
          </ZenCard>

          {/* Información del Proyecto */}
          <ZenCard variant="default" padding="lg">
            <ZenCardHeader>
              <ZenCardTitle>Características ZEN</ZenCardTitle>
              <ZenCardDescription>
                Design System unificado con tema oscuro zinc
              </ZenCardDescription>
            </ZenCardHeader>
            <ZenCardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Componentes unificados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Estados de loading automáticos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Design tokens centralizados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Validación integrada</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Tema oscuro consistente</span>
                </div>
              </div>
            </ZenCardContent>
          </ZenCard>
        </div>

        {/* Sección de Comandos MCP */}
        <ZenCard variant="default" padding="lg">
          <ZenCardHeader>
            <ZenCardTitle>Comandos MCP Disponibles</ZenCardTitle>
            <ZenCardDescription>
              Usa estos comandos en Cursor para explorar e instalar componentes
            </ZenCardDescription>
          </ZenCardHeader>
          <ZenCardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-200">Exploración:</h4>
                <div className="bg-zinc-900 p-3 rounded-md">
                  <code className="text-green-400 text-sm">
                    &quot;Muéstrame componentes de formulario&quot;
                  </code>
                </div>
                <div className="bg-zinc-900 p-3 rounded-md">
                  <code className="text-green-400 text-sm">
                    &quot;Busca componentes de dashboard&quot;
                  </code>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-zinc-200">Instalación:</h4>
                <div className="bg-zinc-900 p-3 rounded-md">
                  <code className="text-blue-400 text-sm">
                    &quot;Instala un formulario de contacto&quot;
                  </code>
                </div>
                <div className="bg-zinc-900 p-3 rounded-md">
                  <code className="text-blue-400 text-sm">
                    &quot;Agrega @zen/button&quot;
                  </code>
                </div>
              </div>
            </div>
          </ZenCardContent>
        </ZenCard>

        {/* Footer */}
        <div className="text-center text-zinc-500 text-sm">
          <p>ProSocial Platform - MCP + ZEN Design System Integration</p>
          <p>Desarrollado con Next.js 15, React 19, TypeScript 5 y Supabase</p>
        </div>
          </div>
        </main>
      </div>
    </ZenSidebarProvider>
  );
}
