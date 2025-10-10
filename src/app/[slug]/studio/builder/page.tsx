import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function BuilderPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Bienvenido al Studio Builder
                </h1>
                <p className="text-xl text-zinc-400 mb-8">
                    Configura tu presencia digital y haz que tu estudio destaque
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Identidad */}
                <ZenCard variant="default" padding="none">
                    <ZenCardHeader className="border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                <Sparkles className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <ZenCardTitle>Identidad</ZenCardTitle>
                                <ZenCardDescription>
                                    Logo, nombre y elementos de marca
                                </ZenCardDescription>
                            </div>
                        </div>
                    </ZenCardHeader>
                    <ZenCardContent className="p-6">
                        <p className="text-zinc-400 mb-4">
                            Define la identidad visual de tu estudio con logo, colores y elementos de marca.
                        </p>
                        <Link href="/studio/builder/identidad">
                            <ZenButton variant="primary" className="w-full">
                                Configurar Identidad
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </ZenButton>
                        </Link>
                    </ZenCardContent>
                </ZenCard>

                {/* Redes Sociales */}
                <ZenCard variant="default" padding="none">
                    <ZenCardHeader className="border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600/20 rounded-lg">
                                <Sparkles className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <ZenCardTitle>Redes Sociales</ZenCardTitle>
                                <ZenCardDescription>
                                    Perfiles y enlaces sociales
                                </ZenCardDescription>
                            </div>
                        </div>
                    </ZenCardHeader>
                    <ZenCardContent className="p-6">
                        <p className="text-zinc-400 mb-4">
                            Conecta tus perfiles sociales y haz que sean fáciles de encontrar.
                        </p>
                        <Link href="/studio/builder/redes">
                            <ZenButton variant="primary" className="w-full">
                                Configurar Redes
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </ZenButton>
                        </Link>
                    </ZenCardContent>
                </ZenCard>
            </div>

            <div className="text-center">
                <p className="text-zinc-500 text-sm">
                    Usa la barra lateral para navegar entre las diferentes secciones de configuración
                </p>
            </div>
        </div>
    );
}
