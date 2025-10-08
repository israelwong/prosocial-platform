'use client';

import React, { useState, useEffect } from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ZenInput } from '@/components/ui/zen';
import { ZenTextarea } from '@/components/ui/zen';
import { Plus, MapPin, Globe, Loader2 } from 'lucide-react';
import { ContactoItemZen } from './ContactoItemZen';
import { Telefono, ContactoData } from '../types';
import { toast } from 'sonner';

interface ContactoListZenProps {
    telefonos: Telefono[];
    contactoData: ContactoData;
    onAddTelefono: () => void;
    onEditTelefono: (telefono: Telefono) => void;
    onDeleteTelefono: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    onUpdateContactoData: (field: keyof ContactoData, value: string) => void;
    onSaveContactoData: (field: keyof ContactoData, value: string) => Promise<void>;
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
    onSaveContactoData,
    loading
}: ContactoListZenProps) {
    const [savingField, setSavingField] = useState<string | null>(null);
    const [localData, setLocalData] = useState<ContactoData>(contactoData);

    // Sincronizar estado local con props
    useEffect(() => {
        setLocalData(contactoData);
    }, [contactoData]);

    const handleFieldBlur = async (field: keyof ContactoData) => {
        const value = localData[field];
        setSavingField(field);
        try {
            await onSaveContactoData(field, value);
            const fieldLabels = {
                direccion: 'dirección del negocio',
                website: 'página web'
            };
            toast.success(`${fieldLabels[field]} actualizada exitosamente`);
        } catch (error) {
            console.error('Error in handleFieldBlur:', error);
            toast.error(`Error al actualizar ${field === 'direccion' ? 'la dirección' : 'la página web'}`);
        } finally {
            setSavingField(null);
        }
    };

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

            {/* Dirección */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Dirección</ZenCardTitle>
                            <ZenCardDescription>
                                Ubicación física de tu estudio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={() => handleFieldBlur('direccion')}
                            disabled={savingField === 'direccion'}
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            {savingField === 'direccion' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <MapPin className="h-4 w-4" />
                            <span>Dirección Completa</span>
                        </div>
                        <ZenTextarea
                            label=""
                            value={localData.direccion}
                            onChange={(e) => setLocalData(prev => ({ ...prev, direccion: e.target.value }))}
                            className="min-h-[100px]"
                            placeholder="Calle, número, colonia, ciudad, estado, código postal"
                        />
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Página Web */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Página Web</ZenCardTitle>
                            <ZenCardDescription>
                                Sitio web oficial de tu estudio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={() => handleFieldBlur('website')}
                            disabled={savingField === 'website'}
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            {savingField === 'website' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Globe className="h-4 w-4" />
                            <span>URL del Sitio Web</span>
                        </div>
                        <ZenInput
                            label=""
                            value={localData.website}
                            onChange={(e) => setLocalData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://www.tu-estudio.com"
                            type="url"
                        />
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
