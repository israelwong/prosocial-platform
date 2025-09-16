"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Save, Building2, Phone, Headphones, MapPin, Share2, FileText, Search, Settings } from 'lucide-react';

interface PlatformConfig {
    id: string;
    nombre_empresa: string;
    logo_url: string | null;
    favicon_url: string | null;
    comercial_telefono: string | null;
    comercial_email: string | null;
    comercial_whatsapp: string | null;
    soporte_telefono: string | null;
    soporte_email: string | null;
    soporte_chat_url: string | null;
    direccion: string | null;
    horarios_atencion: string | null;
    timezone: string;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    terminos_condiciones: string | null;
    politica_privacidad: string | null;
    aviso_legal: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    google_analytics_id: string | null;
    google_tag_manager_id: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface ConfiguracionPageClientProps {
    initialConfig: PlatformConfig | null;
}

const timezones = [
    { value: 'America/Mexico_City', label: 'México (CDMX)' },
    { value: 'America/New_York', label: 'Nueva York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (PST)' },
    { value: 'America/Chicago', label: 'Chicago (CST)' },
    { value: 'Europe/Madrid', label: 'Madrid (CET)' },
    { value: 'Europe/London', label: 'Londres (GMT)' },
];

export function ConfiguracionPageClient({ initialConfig }: ConfiguracionPageClientProps) {
    const [config, setConfig] = useState<PlatformConfig | null>(initialConfig);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof PlatformConfig, value: string) => {
        if (config) {
            setConfig({
                ...config,
                [field]: value
            });
        }
    };

    const handleSave = async () => {
        if (!config) return;

        setLoading(true);
        try {
            const response = await fetch('/api/platform-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...config,
                    updatedAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la configuración');
            }

            toast.success('Configuración guardada exitosamente');
        } catch (error) {
            console.error('Error saving config:', error);
            toast.error('Error al guardar la configuración');
        } finally {
            setLoading(false);
        }
    };

    if (!config) {
        return (
            <Card className="border border-zinc-800 bg-zinc-900">
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-zinc-400">No se encontró configuración de la plataforma</p>
                        <p className="text-sm text-zinc-500 mt-2">
                            Contacta al administrador del sistema
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border border-zinc-800 bg-zinc-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Configuración de la Plataforma
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gestiona la configuración general de la plataforma
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Guardar Cambios
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-6 bg-zinc-800">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger value="comercial" className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Comercial
                            </TabsTrigger>
                            <TabsTrigger value="soporte" className="flex items-center gap-2">
                                <Headphones className="w-4 h-4" />
                                Soporte
                            </TabsTrigger>
                            <TabsTrigger value="ubicacion" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Ubicación
                            </TabsTrigger>
                            <TabsTrigger value="redes" className="flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Redes
                            </TabsTrigger>
                            <TabsTrigger value="legal" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Legal
                            </TabsTrigger>
                        </TabsList>

                        {/* Información General */}
                        <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre_empresa" className="text-white">
                                        Nombre de la Empresa *
                                    </Label>
                                    <Input
                                        id="nombre_empresa"
                                        value={config.nombre_empresa}
                                        onChange={(e) => handleInputChange('nombre_empresa', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="Nombre de la empresa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo_url" className="text-white">
                                        URL del Logo
                                    </Label>
                                    <Input
                                        id="logo_url"
                                        value={config.logo_url || ''}
                                        onChange={(e) => handleInputChange('logo_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://ejemplo.com/logo.png"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="favicon_url" className="text-white">
                                        URL del Favicon
                                    </Label>
                                    <Input
                                        id="favicon_url"
                                        value={config.favicon_url || ''}
                                        onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://ejemplo.com/favicon.ico"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone" className="text-white">
                                        Zona Horaria
                                    </Label>
                                    <Select
                                        value={config.timezone}
                                        onValueChange={(value) => handleInputChange('timezone', value)}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((tz) => (
                                                <SelectItem key={tz.value} value={tz.value}>
                                                    {tz.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Contacto Comercial */}
                        <TabsContent value="comercial" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="comercial_telefono" className="text-white">
                                        Teléfono Comercial
                                    </Label>
                                    <Input
                                        id="comercial_telefono"
                                        value={config.comercial_telefono || ''}
                                        onChange={(e) => handleInputChange('comercial_telefono', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="+52 55 1234 5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comercial_email" className="text-white">
                                        Email Comercial
                                    </Label>
                                    <Input
                                        id="comercial_email"
                                        type="email"
                                        value={config.comercial_email || ''}
                                        onChange={(e) => handleInputChange('comercial_email', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="comercial@empresa.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comercial_whatsapp" className="text-white">
                                        WhatsApp Comercial
                                    </Label>
                                    <Input
                                        id="comercial_whatsapp"
                                        value={config.comercial_whatsapp || ''}
                                        onChange={(e) => handleInputChange('comercial_whatsapp', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="+52 55 1234 5678"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Contacto Soporte */}
                        <TabsContent value="soporte" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="soporte_telefono" className="text-white">
                                        Teléfono de Soporte
                                    </Label>
                                    <Input
                                        id="soporte_telefono"
                                        value={config.soporte_telefono || ''}
                                        onChange={(e) => handleInputChange('soporte_telefono', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="+52 55 1234 5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="soporte_email" className="text-white">
                                        Email de Soporte
                                    </Label>
                                    <Input
                                        id="soporte_email"
                                        type="email"
                                        value={config.soporte_email || ''}
                                        onChange={(e) => handleInputChange('soporte_email', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="soporte@empresa.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="soporte_chat_url" className="text-white">
                                        URL del Chat de Soporte
                                    </Label>
                                    <Input
                                        id="soporte_chat_url"
                                        value={config.soporte_chat_url || ''}
                                        onChange={(e) => handleInputChange('soporte_chat_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://chat.empresa.com"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Ubicación */}
                        <TabsContent value="ubicacion" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="direccion" className="text-white">
                                        Dirección
                                    </Label>
                                    <Textarea
                                        id="direccion"
                                        value={config.direccion || ''}
                                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="Dirección completa de la empresa"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="horarios_atencion" className="text-white">
                                        Horarios de Atención
                                    </Label>
                                    <Textarea
                                        id="horarios_atencion"
                                        value={config.horarios_atencion || ''}
                                        onChange={(e) => handleInputChange('horarios_atencion', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="Lunes a Viernes: 9:00 AM - 6:00 PM"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Redes Sociales */}
                        <TabsContent value="redes" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="facebook_url" className="text-white">
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook_url"
                                        value={config.facebook_url || ''}
                                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://facebook.com/empresa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram_url" className="text-white">
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram_url"
                                        value={config.instagram_url || ''}
                                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://instagram.com/empresa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_url" className="text-white">
                                        Twitter
                                    </Label>
                                    <Input
                                        id="twitter_url"
                                        value={config.twitter_url || ''}
                                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://twitter.com/empresa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url" className="text-white">
                                        LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin_url"
                                        value={config.linkedin_url || ''}
                                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="https://linkedin.com/company/empresa"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Legal */}
                        <TabsContent value="legal" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="terminos_condiciones" className="text-white">
                                        Términos y Condiciones
                                    </Label>
                                    <Textarea
                                        id="terminos_condiciones"
                                        value={config.terminos_condiciones || ''}
                                        onChange={(e) => handleInputChange('terminos_condiciones', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="URL o contenido de términos y condiciones"
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="politica_privacidad" className="text-white">
                                        Política de Privacidad
                                    </Label>
                                    <Textarea
                                        id="politica_privacidad"
                                        value={config.politica_privacidad || ''}
                                        onChange={(e) => handleInputChange('politica_privacidad', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="URL o contenido de política de privacidad"
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aviso_legal" className="text-white">
                                        Aviso Legal
                                    </Label>
                                    <Textarea
                                        id="aviso_legal"
                                        value={config.aviso_legal || ''}
                                        onChange={(e) => handleInputChange('aviso_legal', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="URL o contenido de aviso legal"
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meta_description" className="text-white">
                                        Meta Description (SEO)
                                    </Label>
                                    <Textarea
                                        id="meta_description"
                                        value={config.meta_description || ''}
                                        onChange={(e) => handleInputChange('meta_description', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="Descripción para motores de búsqueda"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meta_keywords" className="text-white">
                                        Meta Keywords (SEO)
                                    </Label>
                                    <Input
                                        id="meta_keywords"
                                        value={config.meta_keywords || ''}
                                        onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        placeholder="palabra1, palabra2, palabra3"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="google_analytics_id" className="text-white">
                                            Google Analytics ID
                                        </Label>
                                        <Input
                                            id="google_analytics_id"
                                            value={config.google_analytics_id || ''}
                                            onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                            placeholder="GA-XXXXXXXXX-X"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="google_tag_manager_id" className="text-white">
                                            Google Tag Manager ID
                                        </Label>
                                        <Input
                                            id="google_tag_manager_id"
                                            value={config.google_tag_manager_id || ''}
                                            onChange={(e) => handleInputChange('google_tag_manager_id', e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                            placeholder="GTM-XXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
