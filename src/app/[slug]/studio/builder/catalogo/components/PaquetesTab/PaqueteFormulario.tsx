'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenCard,
    ZenCardContent,
    ZenCardHeader,
    ZenCardTitle,
} from '@/components/ui/zen';
import {
    crearPaquete,
    actualizarPaquete,
} from '@/lib/actions/studio/builder/catalogo/paquetes.actions';
import { formatearMoneda } from '@/lib/actions/studio/builder/catalogo/calcular-precio';

interface PaqueteFormularioProps {
    studioSlug: string;
    paquete?: {
        id: string;
        name: string;
        event_type_id: string;
        precio?: number | null;
        cost?: number | null;
        expense?: number | null;
        utilidad?: number | null;
    } | null;
    onSave: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function PaqueteFormulario({
    studioSlug,
    paquete,
    onSave,
    onCancel,
    isLoading = false,
}: PaqueteFormularioProps) {
    const [nombre, setNombre] = useState(paquete?.name || '');
    const [eventTypeId, setEventTypeId] = useState(paquete?.event_type_id || '');
    const [costo, setCosto] = useState(paquete?.cost?.toString() || '0');
    const [gasto, setGasto] = useState(paquete?.expense?.toString() || '0');
    const [precio, setPrecio] = useState(paquete?.precio?.toString() || '0');
    const [guardando, setGuardando] = useState(false);

    const costoNum = parseFloat(costo) || 0;
    const gastoNum = parseFloat(gasto) || 0;
    const precioNum = parseFloat(precio) || 0;

    // Calcular utilidad
    const utilidad = precioNum - costoNum - gastoNum;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error('El nombre del paquete es obligatorio');
            return;
        }

        if (!eventTypeId) {
            toast.error('Debe seleccionar un tipo de evento');
            return;
        }

        setGuardando(true);
        try {
            const data = {
                name: nombre,
                event_type_id: eventTypeId,
                cost: costoNum,
                expense: gastoNum,
                precio: precioNum,
                utilidad: utilidad,
            };

            let result;
            if (paquete?.id) {
                result = await actualizarPaquete(studioSlug, paquete.id, data);
            } else {
                result = await crearPaquete(studioSlug, data);
            }

            if (result.success) {
                toast.success(
                    paquete?.id
                        ? 'Paquete actualizado correctamente'
                        : 'Paquete creado correctamente'
                );
                onSave(result.data);
            } else {
                toast.error(result.error || 'Error al guardar el paquete');
            }
        } catch (error) {
            toast.error('Error al guardar el paquete');
            console.error(error);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <ZenCard className="border-blue-500/30">
            <ZenCardHeader className="border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <ZenCardTitle>
                        {paquete?.id ? 'Editar Paquete' : 'Nuevo Paquete'}
                    </ZenCardTitle>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>
            </ZenCardHeader>

            <ZenCardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <ZenInput
                        label="Nombre del Paquete"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Paquete Fotógrafo"
                        required
                    />

                    {/* Tipo de Evento */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Tipo de Evento
                        </label>
                        <input
                            type="text"
                            value={eventTypeId}
                            onChange={(e) => setEventTypeId(e.target.value)}
                            placeholder="ID del tipo de evento"
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Grid de precios */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ZenInput
                            label="Costo"
                            type="number"
                            value={costo}
                            onChange={(e) => setCosto(e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        <ZenInput
                            label="Gasto"
                            type="number"
                            value={gasto}
                            onChange={(e) => setGasto(e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        <ZenInput
                            label="Precio Público"
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    {/* Resumen de cálculos */}
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Costo Total:</span>
                            <span className="text-white font-medium">
                                {formatearMoneda(costoNum + gastoNum)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-zinc-700 pt-2">
                            <span className={`font-medium ${utilidad >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                Utilidad Neta:
                            </span>
                            <span className={`font-bold ${utilidad >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {formatearMoneda(utilidad)}
                            </span>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-4">
                        <ZenButton
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={guardando}
                            className="flex-1"
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            type="submit"
                            variant="primary"
                            loading={guardando}
                            loadingText="Guardando..."
                            disabled={guardando}
                            className="flex-1"
                        >
                            {paquete?.id ? 'Actualizar' : 'Crear'} Paquete
                        </ZenButton>
                    </div>
                </form>
            </ZenCardContent>
        </ZenCard>
    );
}
