import React from 'react';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';
import { StudioBuilderSidebar } from './components/StudioBuilderSidebar';
import { AppHeader } from '../components/AppHeader';
import { StudioMobilePreview } from '../configuracion/studio/components/StudioMobilePreview';

export default async function BuilderLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = await params;

    return (
        <ZenSidebarProvider>
            <div className="flex h-screen overflow-hidden">
                <StudioBuilderSidebar studioSlug={slug} />
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <AppHeader studioSlug={slug} />
                        <div className="flex flex-1 overflow-hidden">
                            {/* Editor - Contenido principal */}
                            <main className="flex-1 overflow-y-auto bg-zinc-900/40">
                                <div className="mx-auto max-w-md p-4 md:p-6">
                                    {children}
                                </div>
                            </main>

                            {/* Mobile Preview - Vista previa persistente */}
                            <aside className="hidden lg:block w-[26rem] border-l border-zinc-800 bg-zinc-900/50 overflow-y-auto">
                                <div className="p-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-white mb-2">Vista Previa</h3>
                                        <p className="text-sm text-zinc-400">Cómo se ve tu perfil móvil</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-[375px] max-w-[375px]">
                                            <StudioMobilePreview
                                                data={{
                                                    id: 'temp-id',
                                                    studio_name: 'Mi Estudio',
                                                    slug: slug,
                                                    slogan: null,
                                                    descripcion: null,
                                                    palabras_clave: [],
                                                    logo_url: null,
                                                    isotipo_url: null,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </ZenSidebarProvider>
    );
}
