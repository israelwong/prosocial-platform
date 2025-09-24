'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin, Globe, Loader2 } from 'lucide-react';
import { ContactoItem } from './ContactoItem';
import { Telefono, ContactoData } from '../types';
import { toast } from 'sonner';

interface ContactoListProps {
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

export function ContactoList({
    telefonos,
    contactoData,
    onAddTelefono,
    onEditTelefono,
    onDeleteTelefono,
    onToggleActive,
    onUpdateContactoData,
    onSaveContactoData,
    loading
}: ContactoListProps) {
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
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Teléfonos de Contacto</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gestiona los números de teléfono de tu estudio
                            </CardDescription>
                        </div>
                        <Button
                            onClick={onAddTelefono}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Teléfono
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <p className="text-zinc-400">No hay teléfonos configurados</p>
                            <p className="text-zinc-500 text-sm mt-2">
                                Agrega números de teléfono para que los clientes puedan contactarte
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {telefonos.map((telefono) => (
                                <ContactoItem
                                    key={telefono.id}
                                    telefono={telefono}
                                    onDelete={onDeleteTelefono}
                                    onEdit={onEditTelefono}
                                    onToggleActive={onToggleActive}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dirección */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Dirección</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Ubicación física de tu estudio
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => handleFieldBlur('direccion')}
                            disabled={savingField === 'direccion'}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {savingField === 'direccion' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="direccion" className="text-zinc-300">Dirección Completa</Label>
                        <Textarea
                            id="direccion"
                            value={localData.direccion}
                            onChange={(e) => setLocalData(prev => ({ ...prev, direccion: e.target.value }))}
                            className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                            placeholder="Calle, número, colonia, ciudad, estado, código postal"
                        />
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                        <MapPin className="h-4 w-4" />
                        <span>Esta dirección aparecerá en tu landing page y documentos oficiales</span>
                    </div>
                </CardContent>
            </Card>

            {/* Página Web */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Página Web</CardTitle>
                            <CardDescription className="text-zinc-400">
                                Sitio web oficial de tu estudio
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => handleFieldBlur('website')}
                            disabled={savingField === 'website'}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {savingField === 'website' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-zinc-300">URL del Sitio Web</Label>
                        <Input
                            id="website"
                            value={localData.website}
                            onChange={(e) => setLocalData(prev => ({ ...prev, website: e.target.value }))}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="https://www.tu-estudio.com"
                        />
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                        <Globe className="h-4 w-4" />
                        <span>Este enlace aparecerá en tu landing page y perfiles de redes sociales</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
