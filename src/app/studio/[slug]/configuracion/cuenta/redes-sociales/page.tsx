'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Share2,
    Plus,
    Trash2,
    ExternalLink,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    Globe,
    Loader2
} from 'lucide-react';

interface Plataforma {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string | null;
    color: string | null;
    icono: string | null;
    urlBase: string | null;
    orden: number;
}

interface RedSocial {
    id: string;
    projectId: string;
    plataformaId: string;
    url: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    plataforma: Plataforma;
}

// Mapeo de íconos de Lucide
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    music: Globe, // Para TikTok
    globe: Globe,
};

export default function RedesSocialesPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [redes, setRedes] = useState<RedSocial[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [nuevaRed, setNuevaRed] = useState({
        plataformaId: '',
        url: ''
    });

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar plataformas disponibles y redes sociales en paralelo
            const [plataformasResponse, redesResponse] = await Promise.all([
                fetch('/api/plataformas-redes'),
                fetch(`/api/studios/${slug}/configuracion/cuenta/redes-sociales`)
            ]);

            if (!plataformasResponse.ok) {
                throw new Error('Error al cargar plataformas');
            }

            if (!redesResponse.ok) {
                throw new Error('Error al cargar redes sociales');
            }

            const [plataformasData, redesData] = await Promise.all([
                plataformasResponse.json(),
                redesResponse.json()
            ]);

            setPlataformas(plataformasData);
            setRedes(redesData);

            // Establecer la primera plataforma como default si no hay selección
            if (plataformasData.length > 0 && !nuevaRed.plataformaId) {
                setNuevaRed(prev => ({ ...prev, plataformaId: plataformasData[0].id }));
            }
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleAddRed = async () => {
        if (!nuevaRed.url.trim()) return;

        const url = nuevaRed.url.trim();

        // Validar URL
        if (!validateUrl(url)) {
            alert('Por favor ingresa una URL válida (ej: https://www.ejemplo.com)');
            return;
        }

        // Verificar si ya existe una red social de la misma plataforma
        const existePlataforma = redes.some(red =>
            red.plataformaId === nuevaRed.plataformaId && red.activo
        );

        if (existePlataforma) {
            const plataforma = plataformas.find(p => p.id === nuevaRed.plataformaId);
            alert(`Ya tienes una red social activa de ${plataforma?.nombre}`);
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(`/api/studios/${slug}/configuracion/cuenta/redes-sociales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plataformaId: nuevaRed.plataformaId,
                    url: url,
                    activo: true
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear red social');
            }

            const nuevaRedSocial = await response.json();
            setRedes(prev => [...prev, nuevaRedSocial]);
            setNuevaRed({ plataformaId: '', url: '' });

        } catch (err) {
            console.error('Error al agregar red social:', err);
            alert('Error al agregar la red social');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveRed = async (id: string) => {
        try {
            setSaving(true);

            const response = await fetch(`/api/studios/${slug}/configuracion/cuenta/redes-sociales/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar red social');
            }

            setRedes(prev => prev.filter(r => r.id !== id));

        } catch (err) {
            console.error('Error al eliminar red social:', err);
            alert('Error al eliminar la red social');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleRed = async (id: string) => {
        const red = redes.find(r => r.id === id);
        if (!red) return;

        try {
            setSaving(true);

            const response = await fetch(`/api/studios/${slug}/configuracion/cuenta/redes-sociales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activo: !red.activo
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar red social');
            }

            const redActualizada = await response.json();
            setRedes(prev => prev.map(r =>
                r.id === id ? redActualizada : r
            ));

        } catch (err) {
            console.error('Error al actualizar red social:', err);
            alert('Error al actualizar la red social');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateRed = async (id: string, field: string, value: string) => {
        if (field === 'url' && value.trim()) {
            // Validar URL solo si no está vacía
            if (!validateUrl(value.trim())) {
                alert('Por favor ingresa una URL válida (ej: https://www.ejemplo.com)');
                return;
            }
        }

        try {
            setSaving(true);

            const response = await fetch(`/api/studios/${slug}/configuracion/cuenta/redes-sociales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [field]: value
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar red social');
            }

            const redActualizada = await response.json();
            setRedes(prev => prev.map(r =>
                r.id === id ? redActualizada : r
            ));

        } catch (err) {
            console.error('Error al actualizar red social:', err);
            alert('Error al actualizar la red social');
        } finally {
            setSaving(false);
        }
    };


    const getPlataformaInfo = (plataformaId: string) => {
        return plataformas.find(p => p.id === plataformaId);
    };

    const getIconComponent = (icono: string | null) => {
        if (!icono) return Globe;
        return iconMap[icono] || Globe;
    };

    const handleSave = async () => {
        try {
            // Validar que todas las URLs activas sean válidas
            const redesActivas = redes.filter(r => r.activo);
            for (const red of redesActivas) {
                if (!validateUrl(red.url)) {
                    const plataforma = getPlataformaInfo(red.plataformaId);
                    alert(`La URL de ${plataforma?.nombre} no es válida`);
                    return;
                }
            }

            // Recargar datos para asegurar sincronización
            await loadData();
            alert('Redes sociales sincronizadas exitosamente');
        } catch (error) {
            console.error('Error al sincronizar:', error);
            alert('Error al sincronizar las redes sociales');
        }
    };

    const redesActivas = redes.filter(r => r.activo).length;
    const redesInactivas = redes.filter(r => !r.activo).length;

    // Mostrar loading
    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-400">Cargando redes sociales...</p>
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="p-6">
                <Card className="bg-red-900/20 border-red-500">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-red-400 mb-4">{error}</p>
                            <Button onClick={loadData} variant="outline">
                                Reintentar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Botón de guardar */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Share2 className="h-4 w-4 mr-2" />
                    )}
                    {saving ? 'Sincronizando...' : 'Sincronizar Cambios'}
                </Button>
            </div>

            {/* Resumen */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-800 border-zinc-700">
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

                <Card className="bg-zinc-800 border-zinc-700">
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

                <Card className="bg-zinc-800 border-zinc-700">
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
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Redes Sociales Configuradas</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Gestiona tus enlaces a redes sociales y sitios web
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {redes.map((red) => {
                        const plataformaInfo = getPlataformaInfo(red.plataformaId);
                        const IconComponent = getIconComponent(plataformaInfo?.icono || null);

                        return (
                            <div key={red.id} className="p-4 bg-zinc-800 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: plataformaInfo?.color || '#6B7280' }}
                                        >
                                            <IconComponent className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-white font-medium">{plataformaInfo?.nombre}</p>
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
                                            disabled={saving}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={red.url}
                                            onChange={(e) => handleUpdateRed(red.id, 'url', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                            className={`bg-zinc-700 border-zinc-600 text-white text-sm flex-1 ${red.url && !validateUrl(red.url) ? 'border-red-500' : ''
                                                }`}
                                            placeholder="https://..."
                                            disabled={!red.activo}
                                        />
                                        {red.url && !validateUrl(red.url) && (
                                            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                                URL inválida
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(red.url, '_blank')}
                                        disabled={!red.activo || !red.url || !validateUrl(red.url)}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Agregar nueva red social */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Agregar Nueva Red Social</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Añade enlaces a tus redes sociales o sitios web
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <select
                            value={nuevaRed.plataformaId}
                            onChange={(e) => setNuevaRed(prev => ({ ...prev, plataformaId: e.target.value }))}
                            className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2"
                        >
                            {plataformas.map((plataforma) => (
                                <option key={plataforma.id} value={plataforma.id}>
                                    {plataforma.nombre}
                                </option>
                            ))}
                        </select>

                        <Input
                            value={nuevaRed.url}
                            onChange={(e) => setNuevaRed(prev => ({ ...prev, url: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddRed()}
                            className="flex-1 bg-zinc-800 border-zinc-700 text-white min-w-[300px]"
                            placeholder="https://..."
                        />

                        <Button
                            onClick={handleAddRed}
                            variant="outline"
                            disabled={saving || !nuevaRed.url.trim()}
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
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
    );
}
