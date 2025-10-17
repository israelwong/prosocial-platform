'use client';

import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { ZenButton, ZenInput, ZenCard } from '@/components/ui/zen';
import { PaqueteItem } from './PaqueteItem';
import { PaqueteFormulario } from './PaqueteFormulario';
import type { PaqueteFromDB } from '@/lib/actions/schemas/paquete-schemas';

interface PaquetesListProps {
    studioSlug: string;
    initialPaquetes: PaqueteFromDB[];
    onPaquetesChange: (paquetes: PaqueteFromDB[]) => void;
}

export function PaquetesList({
    studioSlug,
    initialPaquetes,
    onPaquetesChange,
}: PaquetesListProps) {
    const [paquetes, setPaquetes] = useState<PaqueteFromDB[]>(initialPaquetes);
    const [showForm, setShowForm] = useState(false);
    const [editingPaquete, setEditingPaquete] = useState<PaqueteFromDB | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar paquetes por búsqueda
    const filteredPaquetes = paquetes.filter((paquete) =>
        paquete.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (paqueteId: string) => {
        const paquete = paquetes.find((p) => p.id === paqueteId);
        if (paquete) {
            setEditingPaquete(paquete);
            setShowForm(true);
        }
    };

    const handleDelete = (paqueteId: string) => {
        const newPaquetes = paquetes.filter((p) => p.id !== paqueteId);
        setPaquetes(newPaquetes);
        onPaquetesChange(newPaquetes);
    };

    const handleDuplicate = (newPaquete: PaqueteFromDB) => {
        const newPaquetes = [...paquetes, newPaquete];
        setPaquetes(newPaquetes);
        onPaquetesChange(newPaquetes);
    };

    const handleSave = (savedPaquete: PaqueteFromDB) => {
        if (editingPaquete) {
            // Actualizar paquete existente
            const newPaquetes = paquetes.map((p) =>
                p.id === editingPaquete.id ? savedPaquete : p
            );
            setPaquetes(newPaquetes);
            onPaquetesChange(newPaquetes);
        } else {
            // Crear nuevo paquete
            const newPaquetes = [...paquetes, savedPaquete];
            setPaquetes(newPaquetes);
            onPaquetesChange(newPaquetes);
        }
        setShowForm(false);
        setEditingPaquete(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingPaquete(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <ZenButton
                    onClick={() => {
                        setEditingPaquete(null);
                        setShowForm(true);
                    }}
                    variant="primary"
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Paquete
                </ZenButton>

                {/* Búsqueda */}
                <ZenInput
                    placeholder="Buscar paquetes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                />
            </div>

            {/* Formulario */}
            {showForm && (
                <PaqueteFormulario
                    studioSlug={studioSlug}
                    paquete={editingPaquete}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            {/* Lista de paquetes */}
            {filteredPaquetes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPaquetes.map((paquete) => (
                        <PaqueteItem
                            key={paquete.id}
                            paquete={paquete}
                            studioSlug={studioSlug}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    ))}
                </div>
            ) : (
                <ZenCard className="border-zinc-800/50">
                    <div className="p-12 text-center">
                        <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {searchTerm ? 'No se encontraron paquetes' : 'No hay paquetes'}
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            {searchTerm
                                ? 'Intenta ajustar los términos de búsqueda'
                                : 'Crea tu primer paquete para comenzar'}
                        </p>
                        {!searchTerm && (
                            <ZenButton
                                onClick={() => {
                                    setEditingPaquete(null);
                                    setShowForm(true);
                                }}
                                variant="primary"
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Crear Paquete
                            </ZenButton>
                        )}
                    </div>
                </ZenCard>
            )}
        </div>
    );
}
