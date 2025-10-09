'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Plus } from 'lucide-react';
import { ContactoItemZen } from './ContactoItemZen';
import { Telefono, ContactoData } from '../types';

interface ContactoListZenProps {
    telefonos: Telefono[];
    contactoData: ContactoData;
    onAddTelefono: (data: unknown) => void;
    onEditTelefono: (telefono: Telefono) => void;
    onDeleteTelefono: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    onUpdateContactoData: (field: keyof ContactoData, value: string) => void;
    loading?: boolean;
}

export function ContactoListZen({
    telefonos,
    contactoData,
    onAddTelefono,
    onEditTelefono,
    onDeleteTelefono,
    onToggleActive,
    onUpdateContactoData,
    loading
}: ContactoListZenProps) {

    return (
        <div className="space-y-6">
            {/* Teléfonos */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Teléfonos de Contacto</ZenCardTitle>
                            <ZenCardDescription>
                                Gestiona los números de teléfono de tu estudio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={onAddTelefono}
                            variant="primary"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Teléfono
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-16 bg-zinc-700 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : telefonos.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                <Plus className="h-8 w-8 text-zinc-500" />
                            </div>
                            <p className="text-zinc-400 mb-2">No hay teléfonos configurados</p>
                            <p className="text-zinc-500 text-sm">
                                Agrega números de teléfono para que los clientes puedan contactarte
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {telefonos.map((telefono) => (
                                <ContactoItemZen
                                    key={telefono.id}
                                    telefono={telefono}
                                    onDelete={onDeleteTelefono}
                                    onEdit={onEditTelefono}
                                    onToggleActive={onToggleActive}
                                />
                            ))}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
