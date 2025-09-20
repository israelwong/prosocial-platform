'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Phone,
    Plus,
    X,
    MapPin,
    Globe,
    Trash2
} from 'lucide-react';

interface Telefono {
    id: string;
    numero: string;
    tipo: 'principal' | 'whatsapp' | 'emergencia' | 'oficina';
    activo: boolean;
}

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        direccion: 'Av. Principal 123, Col. Centro, Ciudad, CP 12345',
        website: 'https://www.studiodemo.com'
    });

    const [telefonos, setTelefonos] = useState<Telefono[]>([
        {
            id: '1',
            numero: '+52 55 1234 5678',
            tipo: 'principal',
            activo: true
        },
        {
            id: '2',
            numero: '+52 55 9876 5432',
            tipo: 'whatsapp',
            activo: true
        }
    ]);

    const [nuevoTelefono, setNuevoTelefono] = useState({
        numero: '',
        tipo: 'principal' as const
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTelefono = () => {
        if (nuevoTelefono.numero.trim()) {
            const telefono: Telefono = {
                id: Date.now().toString(),
                numero: nuevoTelefono.numero.trim(),
                tipo: nuevoTelefono.tipo,
                activo: true
            };
            setTelefonos(prev => [...prev, telefono]);
            setNuevoTelefono({ numero: '', tipo: 'principal' });
        }
    };

    const handleRemoveTelefono = (id: string) => {
        setTelefonos(prev => prev.filter(t => t.id !== id));
    };

    const handleToggleTelefono = (id: string) => {
        setTelefonos(prev => prev.map(t =>
            t.id === id ? { ...t, activo: !t.activo } : t
        ));
    };


    const getTipoLabel = (tipo: string) => {
        const labels = {
            principal: 'Principal',
            whatsapp: 'WhatsApp',
            emergencia: 'Emergencia',
            oficina: 'Oficina'
        };
        return labels[tipo as keyof typeof labels] || tipo;
    };

    const getTipoColor = (tipo: string) => {
        const colors = {
            principal: 'bg-blue-500',
            whatsapp: 'bg-green-500',
            emergencia: 'bg-red-500',
            oficina: 'bg-zinc-500'
        };
        return colors[tipo as keyof typeof colors] || 'bg-zinc-500';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Teléfonos */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Teléfonos de Contacto</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Gestiona los números de teléfono de tu estudio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Lista de teléfonos existentes */}
                    <div className="space-y-3">
                        {telefonos.map((telefono) => (
                            <div key={telefono.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${getTipoColor(telefono.tipo)}`}></div>
                                    <div>
                                        <p className="text-white font-medium">{telefono.numero}</p>
                                        <p className="text-zinc-400 text-sm">{getTipoLabel(telefono.tipo)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleTelefono(telefono.id)}
                                        className={telefono.activo ? 'text-green-400' : 'text-zinc-400'}
                                    >
                                        {telefono.activo ? 'Activo' : 'Inactivo'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveTelefono(telefono.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Agregar nuevo teléfono */}
                    <div className="border-t border-zinc-700 pt-4">
                        <div className="flex space-x-2">
                            <Input
                                value={nuevoTelefono.numero}
                                onChange={(e) => setNuevoTelefono(prev => ({ ...prev, numero: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Número de teléfono"
                            />
                            <Select
                                value={nuevoTelefono.tipo}
                                onValueChange={(value: any) => setNuevoTelefono(prev => ({ ...prev, tipo: value }))}
                            >
                                <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="principal">Principal</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                    <SelectItem value="emergencia">Emergencia</SelectItem>
                                    <SelectItem value="oficina">Oficina</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddTelefono} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dirección */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Dirección</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Ubicación física de tu estudio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="direccion" className="text-zinc-300">Dirección Completa</Label>
                        <Textarea
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) => handleInputChange('direccion', e.target.value)}
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
                    <CardTitle className="text-white">Página Web</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Sitio web oficial de tu estudio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-zinc-300">URL del Sitio Web</Label>
                        <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
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

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usa esta información?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Footer con información de contacto</li>
                                <li>• Formularios de contacto</li>
                                <li>• Botones de WhatsApp</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Cotizaciones y propuestas</li>
                                <li>• Emails y notificaciones</li>
                                <li>• Documentos oficiales</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
