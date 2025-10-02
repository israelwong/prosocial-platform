import React from 'react';
import { redirect } from 'next/navigation';
import { getAllModulesWithStatus } from '@/lib/modules';
import { ZenCard } from '@/components/ui/zen';
import { 
    Package, 
    Sparkles, 
    TrendingUp, 
    Globe, 
    CreditCard, 
    Cloud, 
    MessageCircle, 
    Mail,
    Check,
    Lock
} from 'lucide-react';

// Iconos por módulo
const MODULE_ICONS = {
    'manager': Package,
    'magic': Sparkles,
    'marketing': TrendingUp,
    'pages': Globe,
    'payment': CreditCard,
    'cloud': Cloud,
    'conversations': MessageCircle,
    'invitation': Mail
} as const;

async function getStudioBySlug(slug: string) {
    const { prisma } = await import('@/lib/prisma');
    
    const studio = await prisma.studios.findUnique({
        where: { slug }
    });
    
    return studio;
}

export default async function ModulosPage({
    params
}: {
    params: { slug: string }
}) {
    const { slug } = await params;
    
    const studio = await getStudioBySlug(slug);
    
    if (!studio) {
        redirect('/404');
    }
    
    const modules = await getAllModulesWithStatus(studio.id);
    
    // Separar módulos CORE y ADDON
    const coreModules = modules.filter(m => m.category === 'CORE');
    const addonModules = modules.filter(m => m.category === 'ADDON');
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Módulos del Sistema
                </h1>
                <p className="text-zinc-400">
                    Gestiona los módulos activos y disponibles para tu estudio
                </p>
            </div>
            
            {/* Módulos CORE */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Módulos Core
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Módulos incluidos en tu plan actual
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coreModules.map((module) => {
                        const Icon = MODULE_ICONS[module.slug as keyof typeof MODULE_ICONS] || Package;
                        
                        return (
                            <ZenCard key={module.id} className="relative">
                                {/* Badge de activo */}
                                {module.is_studio_active && (
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 rounded-full">
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs font-medium text-emerald-400">
                                                Activo
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex gap-4">
                                    {/* Icono */}
                                    <div className={`
                                        flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                                        ${module.is_studio_active 
                                            ? 'bg-purple-500/20 text-purple-400' 
                                            : 'bg-zinc-800 text-zinc-500'
                                        }
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white mb-1">
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mb-3">
                                            {module.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
                                                v{module.version}
                                            </span>
                                            <span className="text-xs text-emerald-400">
                                                Incluido en el plan
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ZenCard>
                        );
                    })}
                </div>
            </section>
            
            {/* Módulos ADDON */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Módulos Adicionales
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Funcionalidades premium para ampliar tu sistema
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addonModules.map((module) => {
                        const Icon = MODULE_ICONS[module.slug as keyof typeof MODULE_ICONS] || Package;
                        const isActive = module.is_studio_active;
                        
                        return (
                            <ZenCard key={module.id} className="relative">
                                {/* Badge de estado */}
                                <div className="absolute top-4 right-4">
                                    {isActive ? (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 rounded-full">
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs font-medium text-emerald-400">
                                                Activo
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-full">
                                            <Lock className="w-3.5 h-3.5 text-zinc-500" />
                                            <span className="text-xs font-medium text-zinc-500">
                                                No activo
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-4">
                                    {/* Icono */}
                                    <div className={`
                                        flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                                        ${isActive 
                                            ? 'bg-purple-500/20 text-purple-400' 
                                            : 'bg-zinc-800 text-zinc-500'
                                        }
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white mb-1">
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mb-3">
                                            {module.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
                                                    v{module.version}
                                                </span>
                                                {module.base_price && (
                                                    <span className="text-sm font-semibold text-purple-400">
                                                        ${module.base_price}/mes
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {!isActive && (
                                                <button
                                                    disabled
                                                    className="
                                                        px-3 py-1.5 text-sm font-medium rounded-lg
                                                        bg-purple-500/10 text-purple-400 border border-purple-500/20
                                                        cursor-not-allowed opacity-50
                                                    "
                                                >
                                                    Próximamente
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ZenCard>
                        );
                    })}
                </div>
            </section>
            
            {/* Info adicional */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">
                    💡 <span className="text-white font-medium">Información:</span> Los módulos adicionales estarán disponibles en la próxima iteración. 
                    Podrás activarlos directamente desde aquí y se agregarán a tu suscripción mensual.
                </p>
            </div>
        </div>
    );
}

