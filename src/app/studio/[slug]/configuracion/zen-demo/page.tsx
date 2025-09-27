"use client";

import { ZenButton, ZenCard, ZenCardHeader, ZenCardTitle, ZenCardContent, ZenCardDescription } from "@/components/ui/zen";
import { ConfiguracionSidebarZen, ZenSidebarTrigger, ZenSidebarOverlay } from "../components/ConfiguracionSidebarZen";

/**
 * Página de demostración del refactor ZEN
 * 
 * Esta página muestra la integración del ZenSidebar
 * en el flujo de configuración del estudio
 */
export default function ConfiguracionZenDemoPage() {
    return (
        <div className="flex min-h-screen bg-zinc-950">
            <ConfiguracionSidebarZen />
            <ZenSidebarOverlay />

            <main className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <ZenSidebarTrigger />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Configuración ZEN Demo</h1>
                        <p className="text-zinc-400">Demostración del refactor ZEN en configuración</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            Refactor ZEN - Configuración
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Demostración de la migración del sidebar de configuración a ZEN Design System
                        </p>
                    </div>

                    {/* Grid de Cards */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Características ZEN */}
                        <ZenCard variant="default" padding="lg">
                            <ZenCardHeader>
                                <ZenCardTitle>Características ZEN Sidebar</ZenCardTitle>
                                <ZenCardDescription>
                                    Funcionalidades implementadas con ZEN Design System
                                </ZenCardDescription>
                            </ZenCardHeader>
                            <ZenCardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-zinc-300">Búsqueda de secciones</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-zinc-300">Navegación jerárquica</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-zinc-300">Estados de completado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-zinc-300">Responsive design</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-zinc-300">Estadísticas de progreso</span>
                                    </div>
                                </div>
                            </ZenCardContent>
                        </ZenCard>

                        {/* Mejoras Implementadas */}
                        <ZenCard variant="default" padding="lg">
                            <ZenCardHeader>
                                <ZenCardTitle>Mejoras Implementadas</ZenCardTitle>
                                <ZenCardDescription>
                                    Beneficios del refactor a ZEN Design System
                                </ZenCardDescription>
                            </ZenCardHeader>
                            <ZenCardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-zinc-300">Tema zinc oscuro consistente</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-zinc-300">Design tokens centralizados</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-zinc-300">Mejor responsive</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-zinc-300">Accesibilidad mejorada</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-zinc-300">Estados de loading automáticos</span>
                                    </div>
                                </div>
                            </ZenCardContent>
                        </ZenCard>
                    </div>

                    {/* Secciones de Configuración */}
                    <ZenCard variant="default" padding="lg">
                        <ZenCardHeader>
                            <ZenCardTitle>Secciones de Configuración</ZenCardTitle>
                            <ZenCardDescription>
                                Todas las secciones disponibles en el sidebar ZEN
                            </ZenCardDescription>
                        </ZenCardHeader>
                        <ZenCardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: "Estudio", items: 4, completed: 2 },
                                    { name: "Negocio", items: 4, completed: 1 },
                                    { name: "Equipo", items: 3, completed: 0 },
                                    { name: "Catálogo", items: 4, completed: 0 },
                                    { name: "Cuenta", items: 4, completed: 0 },
                                    { name: "Avanzado", items: 2, completed: 0 }
                                ].map((section) => (
                                    <div key={section.name} className="bg-zinc-800 p-4 rounded-lg">
                                        <h4 className="font-semibold text-zinc-200 mb-2">{section.name}</h4>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            {section.completed}/{section.items} completado
                                        </p>
                                        <div className="w-full bg-zinc-700 rounded-full h-2">
                                            <div
                                                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(section.completed / section.items) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ZenCardContent>
                    </ZenCard>

                    {/* Comandos MCP */}
                    <ZenCard variant="default" padding="lg">
                        <ZenCardHeader>
                            <ZenCardTitle>Comandos MCP para Refactor</ZenCardTitle>
                            <ZenCardDescription>
                                Comandos útiles para acelerar el refactor con MCP
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
                                            &quot;Busca componentes de lista&quot;
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
                        <p>ProSocial Platform - Refactor ZEN en Configuración</p>
                        <p>Desarrollado con Next.js 15, React 19, TypeScript 5 y ZEN Design System</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
