'use client';

import React, { useState } from 'react';
import { ZenButton, ZenInput, ZenTextarea } from '@/components/ui/zen';
import { ZenCard, ZenCardContent } from '@/components/ui/zen';
import { Plus, X, Save, Check } from 'lucide-react';
import { IdentidadData } from '../types';
import { LogoManagerZen } from './LogoManagerZen';
import { RedesSocialesSection } from './RedesSocialesSection';
import { actualizarIdentidadCompleta } from '@/lib/actions/studio/config/identidad.actions';
import { toast } from 'sonner';

interface IdentidadEditorZenProps {
    data: IdentidadData;
    onLocalUpdate: (data: Partial<IdentidadData>) => void;
    onLogoUpdate: (url: string) => Promise<void>;
    onLogoLocalUpdate: (url: string | null) => void;
    studioSlug: string;
    loading?: boolean;
}

export function IdentidadEditorZen({
    data,
    onLocalUpdate,
    onLogoUpdate,
    onLogoLocalUpdate,
    studioSlug,
    loading = false
}: IdentidadEditorZenProps) {
    const [showPalabrasModal, setShowPalabrasModal] = useState(false);
    const [nuevaPalabra, setNuevaPalabra] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('encabezado');

    const handleInputChange = (field: keyof IdentidadData, value: string) => {
        onLocalUpdate({ [field]: value });
    };

    const handleAddPalabra = () => {
        if (nuevaPalabra.trim() && !data.palabras_clave?.includes(nuevaPalabra.trim())) {
            const nuevasPalabras = [...(data.palabras_clave || []), nuevaPalabra.trim()];
            onLocalUpdate({ palabras_clave: nuevasPalabras });
            setNuevaPalabra('');
            setShowPalabrasModal(false);
        }
    };

    const handleRemovePalabra = (palabra: string) => {
        const nuevasPalabras = data.palabras_clave?.filter(p => p !== palabra) || [];
        onLocalUpdate({ palabras_clave: nuevasPalabras });
    };

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const updateData = {
                nombre: data.studio_name || '',
                slogan: data.slogan || undefined,
                logo_url: data.logo_url || undefined,
                isotipo_url: data.isotipo_url || undefined,
                pagina_web: data.pagina_web || undefined,
                palabras_clave: Array.isArray(data.palabras_clave) ? data.palabras_clave.join(', ') : data.palabras_clave || ''
            } as Parameters<typeof actualizarIdentidadCompleta>[1];

            await actualizarIdentidadCompleta(studioSlug, updateData);

            setSaveSuccess(true);
            toast.success('Identidad guardada correctamente');

            // Reset success state after 2 seconds
            setTimeout(() => setSaveSuccess(false), 2000);

        } catch (error) {
            console.error('Error saving identidad:', error);
            toast.error('Error al guardar la identidad. Inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'encabezado', label: 'Encabezado' },
        { id: 'redes', label: 'Redes Sociales' },
        { id: 'footer', label: 'Pie de Página' }
    ];

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-zinc-800">
                <div className="flex space-x-8">
                    {tabs.map((tab) => {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'encabezado' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardContent className="p-6 space-y-4">
                            {/* Ficha de Logo */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Logo Principal
                                </h3>
                                <LogoManagerZen
                                    tipo="logo"
                                    url={data.logo_url}
                                    onUpdate={async (url: string) => {
                                        await onLogoUpdate(url);
                                    }}
                                    onLocalUpdate={(url: string | null) => {
                                        onLogoLocalUpdate(url);
                                    }}
                                    studioSlug={studioSlug}
                                />
                            </div>

                            {/* Nombre del estudio */}
                            <ZenInput
                                label="Nombre del Estudio"
                                required
                                value={data.studio_name || ''}
                                onChange={(e) => handleInputChange('studio_name', e.target.value)}
                                placeholder="Ej: Studio Fotografía María"
                                disabled={loading}
                                hint="Este nombre aparecerá en tu perfil público"
                            />

                            {/* Slogan */}
                            <ZenTextarea
                                label="Slogan"
                                value={data.slogan || ''}
                                onChange={(e) => handleInputChange('slogan', e.target.value)}
                                placeholder="Ej: Capturando momentos únicos"
                                disabled={loading}
                                maxLength={100}
                                hint="Frase corta que describe tu estudio (máximo 100 caracteres)"
                                rows={2}
                            />

                            {/* Botón de Guardar */}
                            <div className="pt-4">
                                <div className="flex justify-end">
                                    <ZenButton
                                        onClick={handleSave}
                                        disabled={loading || isSaving}
                                        loading={isSaving}
                                        loadingText="Guardando..."
                                        variant="primary"
                                        size="sm"
                                    >
                                        {saveSuccess ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Guardado
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </ZenButton>
                                </div>
                            </div>
                        </ZenCardContent>
                    </ZenCard>
                )}

                {activeTab === 'footer' && (
                    <div className="space-y-6">
                        {/* Ficha 1: Palabras Clave SEO */}
                        <ZenCard variant="default" padding="none">
                            <ZenCardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-white">
                                            Palabras Clave SEO
                                        </label>
                                        <ZenButton
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowPalabrasModal(true)}
                                            disabled={loading}
                                            className="text-xs px-2 py-1"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Agregar
                                        </ZenButton>
                                    </div>

                                    {/* Lista de palabras clave */}
                                    {data.palabras_clave && data.palabras_clave.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.palabras_clave.map((palabra, index) => (
                                                <div key={index} className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
                                                    <span>{palabra}</span>
                                                    <button
                                                        onClick={() => handleRemovePalabra(palabra)}
                                                        className="text-zinc-400 hover:text-red-400 transition-colors ml-1"
                                                        disabled={loading}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Modal para agregar palabra */}
                                    {showPalabrasModal && (
                                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-md mx-4">
                                                <h3 className="text-lg font-semibold text-white mb-4">
                                                    Agregar Palabra Clave
                                                </h3>
                                                <ZenInput
                                                    label="Palabra Clave"
                                                    value={nuevaPalabra}
                                                    onChange={(e) => setNuevaPalabra(e.target.value)}
                                                    placeholder="Ej: fotografía, eventos, retratos"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddPalabra()}
                                                />
                                                <div className="flex gap-3 mt-4">
                                                    <ZenButton
                                                        onClick={handleAddPalabra}
                                                        disabled={!nuevaPalabra.trim()}
                                                        size="sm"
                                                    >
                                                        Agregar
                                                    </ZenButton>
                                                    <ZenButton
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowPalabrasModal(false);
                                                            setNuevaPalabra('');
                                                        }}
                                                        size="sm"
                                                    >
                                                        Cancelar
                                                    </ZenButton>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ZenCardContent>
                        </ZenCard>

                        {/* Ficha 2: Página Web y Botón de Guardar */}
                        <ZenCard variant="default" padding="none">
                            <ZenCardContent className="p-6 space-y-4">
                                <ZenInput
                                    label="Página Web (Opcional)"
                                    value={data.pagina_web || ''}
                                    onChange={(e) => handleInputChange('pagina_web', e.target.value)}
                                    placeholder="https://tuestudio.com"
                                    disabled={loading}
                                    hint="Tu sitio web principal"
                                />

                                {/* Botón de Guardar */}
                                <div className="pt-4">
                                    <div className="flex justify-end">
                                        <ZenButton
                                            onClick={handleSave}
                                            disabled={loading || isSaving}
                                            loading={isSaving}
                                            loadingText="Guardando..."
                                            variant="primary"
                                            size="sm"
                                        >
                                            {saveSuccess ? (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Guardado
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </ZenButton>
                                    </div>
                                </div>
                            </ZenCardContent>
                        </ZenCard>
                    </div>
                )}

                {activeTab === 'redes' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardContent className="p-6">
                            <RedesSocialesSection
                                studioSlug={studioSlug}
                                onLocalUpdate={onLocalUpdate}
                            />
                        </ZenCardContent>
                    </ZenCard>
                )}
            </div>
        </div>
    );
}
