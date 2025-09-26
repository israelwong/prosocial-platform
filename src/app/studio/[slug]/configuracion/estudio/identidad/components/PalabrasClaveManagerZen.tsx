'use client';

import React, { useState } from 'react';
import { ZenButton } from '@/components/ui/zen/base/ZenButton';
import { ZenInput } from '@/components/ui/zen/base/ZenInput';
import { ZenBadge } from '@/components/ui/zen/base/ZenBadge';
import { Plus, X, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface PalabrasClaveManagerZenProps {
    palabrasClave: string[];
    onUpdate: (palabras: string[]) => Promise<void>;
    onLocalUpdate: (palabras: string[]) => void;
    loading?: boolean;
}

export function PalabrasClaveManagerZen({
    palabrasClave,
    onUpdate,
    onLocalUpdate,
    loading = false
}: PalabrasClaveManagerZenProps) {
    const [nuevaPalabra, setNuevaPalabra] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleAddPalabra = async () => {
        if (!nuevaPalabra.trim()) return;

        const palabraTrimmed = nuevaPalabra.trim();
        if (palabrasClave.includes(palabraTrimmed)) {
            toast.error('Esta palabra clave ya existe');
            return;
        }

        const nuevasPalabras = [...palabrasClave, palabraTrimmed];
        setUpdating(true);

        // Actualización optimista - actualizar UI inmediatamente
        onLocalUpdate(nuevasPalabras);
        setNuevaPalabra('');

        try {
            await onUpdate(nuevasPalabras);
            toast.success('Palabra clave agregada');
        } catch {
            // Revertir cambios en caso de error
            onLocalUpdate(palabrasClave);
            setNuevaPalabra(palabraTrimmed);
            toast.error('Error al agregar palabra clave');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemovePalabra = async (palabra: string) => {
        const nuevasPalabras = palabrasClave.filter(p => p !== palabra);
        setUpdating(true);

        // Actualización optimista - actualizar UI inmediatamente
        onLocalUpdate(nuevasPalabras);

        try {
            await onUpdate(nuevasPalabras);
            toast.success('Palabra clave eliminada');
        } catch {
            // Revertir cambios en caso de error
            onLocalUpdate(palabrasClave);
            toast.error('Error al eliminar palabra clave');
        } finally {
            setUpdating(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPalabra();
        }
    };

    return (
        <div className="space-y-4">
            {/* Lista de palabras clave con ZEN Badges */}
            {palabrasClave.length > 0 ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Tag className="h-4 w-4" />
                        <span>{palabrasClave.length} palabra{palabrasClave.length !== 1 ? 's' : ''} clave</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {palabrasClave.map((palabra, index) => (
                            <ZenBadge
                                key={index}
                                variant="secondary"
                                size="md"
                                className="group hover:bg-zinc-700 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {palabra}
                                    <button
                                        onClick={() => handleRemovePalabra(palabra)}
                                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all disabled:opacity-50"
                                        disabled={updating || loading}
                                        title="Eliminar palabra clave"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            </ZenBadge>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 text-zinc-500">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay palabras clave agregadas</p>
                    <p className="text-xs text-zinc-600 mt-1">Agrega palabras que describan tu negocio</p>
                </div>
            )}

            {/* Formulario para agregar nueva palabra clave con ZEN components */}
            <div className="space-y-4 p-5 bg-zinc-900/40 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors duration-200">
                <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
                    <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                    </div>
                    <span>Agregar nueva palabra clave</span>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={nuevaPalabra}
                        onChange={(e) => setNuevaPalabra(e.target.value)}
                        placeholder="Ej: fotografía, bodas, eventos..."
                        onKeyPress={handleKeyPress}
                        disabled={updating || loading}
                        className="flex-1 h-10 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ZenButton
                        onClick={handleAddPalabra}
                        variant="primary"
                        size="sm"
                        loading={updating}
                        disabled={!nuevaPalabra.trim() || updating || loading}
                        title="Agregar palabra clave"
                        className="h-10 w-10 p-0 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                    >
                        <Plus className="h-4 w-4" />
                    </ZenButton>
                </div>

                {/* Hint sobre el uso de palabras clave */}
                <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs">💡</span>
                    </div>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                        Las palabras clave ayudan a que los clientes te encuentren en búsquedas
                    </p>
                </div>
            </div>

            {/* Información adicional sobre SEO */}
            {palabrasClave.length > 0 && (
                <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
                    <div className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="text-blue-300 font-medium">Optimización SEO</p>
                            <p className="text-blue-200/80 text-xs mt-1">
                                Estas palabras aparecerán en meta tags y ayudarán con el posicionamiento en buscadores
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
