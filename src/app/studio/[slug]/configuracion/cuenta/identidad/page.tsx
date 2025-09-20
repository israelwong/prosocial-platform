'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Upload,
    Image as ImageIcon,
    Plus,
    X
} from 'lucide-react';

export default function IdentidadPage() {
    const [formData, setFormData] = useState({
        nombre: 'Studio Demo',
        slogan: 'Capturando momentos únicos',
        descripcion: 'Estudio de fotografía especializado en bodas, eventos y sesiones de retrato. Más de 10 años de experiencia creando recuerdos inolvidables.',
        palabras_clave: ['fotografía', 'bodas', 'eventos', 'retratos', 'estudio'],
        logo_url: '',
        isotipo_url: ''
    });

    const [nuevaPalabra, setNuevaPalabra] = useState('');

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddPalabra = () => {
        if (nuevaPalabra.trim() && !formData.palabras_clave.includes(nuevaPalabra.trim())) {
            setFormData(prev => ({
                ...prev,
                palabras_clave: [...prev.palabras_clave, nuevaPalabra.trim()]
            }));
            setNuevaPalabra('');
        }
    };

    const handleRemovePalabra = (palabra: string) => {
        setFormData(prev => ({
            ...prev,
            palabras_clave: prev.palabras_clave.filter(p => p !== palabra)
        }));
    };


    return (
        <div className="p-6 space-y-6">
            {/* Información Básica */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Información Básica</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Datos fundamentales de tu estudio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-zinc-300">Nombre del Negocio</Label>
                            <Input
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Ej: Studio Fotografía María"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slogan" className="text-zinc-300">Slogan</Label>
                            <Input
                                id="slogan"
                                value={formData.slogan}
                                onChange={(e) => handleInputChange('slogan', e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Ej: Capturando momentos únicos"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-zinc-300">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                            placeholder="Describe tu estudio, servicios y experiencia..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Palabras Clave */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Palabras Clave</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Términos que describen tu negocio (SEO y búsquedas)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {formData.palabras_clave.map((palabra, index) => (
                            <Badge key={index} variant="secondary" className="bg-zinc-800 text-zinc-300">
                                {palabra}
                                <button
                                    onClick={() => handleRemovePalabra(palabra)}
                                    className="ml-2 hover:text-red-400"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        <Input
                            value={nuevaPalabra}
                            onChange={(e) => setNuevaPalabra(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Agregar palabra clave"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddPalabra()}
                        />
                        <Button
                            onClick={handleAddPalabra}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logos */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Logo Principal */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white">Logo Principal</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Logo completo con texto (header, tarjetas, documentos)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.logo_url ? (
                            <div className="space-y-3">
                                <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
                                    <ImageIcon className="h-8 w-8 text-zinc-500" />
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Cambiar Logo
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                                        <p className="text-zinc-500 text-sm">Subir Logo</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Seleccionar Archivo
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Isotipo */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white">Isotipo</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Símbolo o ícono sin texto (favicon, redes sociales)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.isotipo_url ? (
                            <div className="space-y-3">
                                <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
                                    <ImageIcon className="h-8 w-8 text-zinc-500" />
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Cambiar Isotipo
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                                        <p className="text-zinc-500 text-sm">Subir Isotipo</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Seleccionar Archivo
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

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
                                <li>• Header con logo y nombre</li>
                                <li>• Footer con información de contacto</li>
                                <li>• Meta tags para SEO</li>
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
