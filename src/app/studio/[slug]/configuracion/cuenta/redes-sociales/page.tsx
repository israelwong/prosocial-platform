'use client';

import React, { useState } from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Share2,
    Plus,
    Trash2,
    Save,
    ExternalLink,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Tiktok,
    Linkedin,
    Globe
} from 'lucide-react';

interface RedSocial {
    id: string;
    plataforma: string;
    url: string;
    activo: boolean;
}

const PLATAFORMAS = [
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { value: 'tiktok', label: 'TikTok', icon: Tiktok, color: 'bg-black' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { value: 'website', label: 'Sitio Web', icon: Globe, color: 'bg-zinc-600' }
];

export default function RedesSocialesPage() {
    const [redes, setRedes] = useState<RedSocial[]>([
        {
            id: '1',
            plataforma: 'facebook',
            url: 'https://facebook.com/studiodemo',
            activo: true
        },
        {
            id: '2',
            plataforma: 'instagram',
            url: 'https://instagram.com/studiodemo',
            activo: true
        },
        {
            id: '3',
            plataforma: 'website',
            url: 'https://www.studiodemo.com',
            activo: true
        }
    ]);

    const [nuevaRed, setNuevaRed] = useState({
        plataforma: 'facebook',
        url: ''
    });

    const handleAddRed = () => {
        if (nuevaRed.url.trim()) {
            const red: RedSocial = {
                id: Date.now().toString(),
                plataforma: nuevaRed.plataforma,
                url: nuevaRed.url.trim(),
                activo: true
            };
            setRedes(prev => [...prev, red]);
            setNuevaRed({ plataforma: 'facebook', url: '' });
        }
    };

    const handleRemoveRed = (id: string) => {
        setRedes(prev => prev.filter(r => r.id !== id));
    };

    const handleToggleRed = (id: string) => {
        setRedes(prev => prev.map(r =>
            r.id === id ? { ...r, activo: !r.activo } : r
        ));
    };

    const handleUpdateRed = (id: string, field: string, value: string) => {
        setRedes(prev => prev.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    const handleSave = () => {
        // TODO: Implementar guardado
        console.log('Guardando redes sociales:', redes);
    };

    const getPlataformaInfo = (plataforma: string) => {
        return PLATAFORMAS.find(p => p.value === plataforma) || PLATAFORMAS[0];
    };

    const redesActivas = redes.filter(r => r.activo).length;
    const redesInactivas = redes.filter(r => !r.activo).length;

    return (
        <SectionLayout
            title="Redes Sociales"
            description="Enlaces a tus redes sociales y sitios web"
            actionButton={{
                label: "Guardar Cambios",
                onClick: handleSave,
                icon: Save
            }}
        >
            <div className="space-y-6">
                {/* Resumen */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Share2 className="h-5 w-5 text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{redesActivas}</p>
                                    <p className="text-sm text-zinc-400">Redes Activas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Share2 className="h-5 w-5 text-zinc-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{redesInactivas}</p>
                                    <p className="text-sm text-zinc-400">Redes Inactivas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{redes.length}</p>
                                    <p className="text-sm text-zinc-400">Total Redes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de redes sociales */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Redes Sociales Configuradas</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona tus enlaces a redes sociales y sitios web
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {redes.map((red) => {
                            const plataformaInfo = getPlataformaInfo(red.plataforma);
                            const IconComponent = plataformaInfo.icon;

                            return (
                                <div key={red.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 ${plataformaInfo.color} rounded-lg flex items-center justify-center`}>
                                            <IconComponent className="h-5 w-5 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-white font-medium">{plataformaInfo.label}</p>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    value={red.url}
                                                    onChange={(e) => handleUpdateRed(red.id, 'url', e.target.value)}
                                                    className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                                    placeholder="https://..."
                                                    disabled={!red.activo}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(red.url, '_blank')}
                                                    disabled={!red.activo || !red.url}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={red.activo}
                                                onCheckedChange={() => handleToggleRed(red.id)}
                                            />
                                            <span className={`text-sm ${red.activo ? 'text-green-400' : 'text-zinc-400'}`}>
                                                {red.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveRed(red.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Agregar nueva red social */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Agregar Nueva Red Social</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Añade enlaces a tus redes sociales o sitios web
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-2">
                            <select
                                value={nuevaRed.plataforma}
                                onChange={(e) => setNuevaRed(prev => ({ ...prev, plataforma: e.target.value }))}
                                className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2"
                            >
                                {PLATAFORMAS.map((plataforma) => (
                                    <option key={plataforma.value} value={plataforma.value}>
                                        {plataforma.label}
                                    </option>
                                ))}
                            </select>

                            <Input
                                value={nuevaRed.url}
                                onChange={(e) => setNuevaRed(prev => ({ ...prev, url: e.target.value }))}
                                className="flex-2 bg-zinc-800 border-zinc-700 text-white"
                                placeholder="https://..."
                            />

                            <Button onClick={handleAddRed} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Información de uso */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">¿Dónde se usan estas redes sociales?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Landing Page</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Footer con enlaces a redes sociales</li>
                                    <li>• Botones de compartir en redes</li>
                                    <li>• Sección de contacto</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Portales y Comunicación</h4>
                                <ul className="text-sm text-zinc-400 space-y-1">
                                    <li>• Emails con enlaces a redes</li>
                                    <li>• Documentos y propuestas</li>
                                    <li>• Integración con redes sociales</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SectionLayout>
    );
}
