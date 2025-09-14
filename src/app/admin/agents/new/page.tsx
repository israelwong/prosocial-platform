'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, User, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CreatedAgent {
    id: string;
    nombre: string;
    email: string;
    authUser: {
        email: string;
        tempPassword: string;
    };
}

export default function NewAgentPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [createdAgent, setCreatedAgent] = useState<CreatedAgent | null>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        activo: true,
        metaMensualLeads: 20,
        comisionConversion: 0.05
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al crear el agente');
            }

            const data = await response.json();
            setCreatedAgent(data);
            toast.success('Agente creado exitosamente');

            // Mostrar las credenciales temporales
            if (data.authUser?.tempPassword) {
                toast.info(`Credenciales generadas para ${data.authUser.email}`);
            }
        } catch (error) {
            console.error('Error creating agent:', error);
            toast.error('Error al crear el agente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStates(prev => ({ ...prev, [key]: true }));
            toast.success('Copiado al portapapeles');

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [key]: false }));
            }, 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.error('Error al copiar al portapapeles');
        }
    };

    const copyAllCredentials = () => {
        if (!createdAgent?.authUser) return;

        const credentials = `
🔐 CREDENCIALES DE ACCESO - PROSOCIAL PLATFORM

👤 Agente: ${createdAgent.nombre}
📧 Email: ${createdAgent.authUser.email}
🔑 Contraseña Temporal: ${createdAgent.authUser.tempPassword}
🌐 URL de Acceso: ${typeof window !== 'undefined' ? window.location.origin : ''}/agente

⚠️ IMPORTANTE:
• Esta contraseña es temporal y debe ser cambiada en el primer inicio de sesión
• Guarda estas credenciales en un lugar seguro
• No compartas esta información por canales no seguros

📱 Soporte: Si tienes problemas para acceder, contacta al administrador del sistema.
        `.trim();

        copyToClipboard(credentials, 'all');
    };

    // Si el agente fue creado, mostrar las credenciales
    if (createdAgent) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/agents">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a Agentes
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Agente Creado Exitosamente</h1>
                        <p className="text-muted-foreground">
                            Credenciales de acceso generadas
                        </p>
                    </div>
                </div>

                {/* Credenciales */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Credenciales de Acceso
                        </CardTitle>
                        <CardDescription>
                            Comparte estas credenciales con el agente para que pueda acceder al sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-muted rounded-md font-mono">
                                        {createdAgent.authUser.email}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(createdAgent.authUser.email, 'email')}
                                        className="shrink-0"
                                    >
                                        {copiedStates.email ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Contraseña Temporal</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-muted rounded-md font-mono">
                                        {createdAgent.authUser.tempPassword}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(createdAgent.authUser.tempPassword, 'password')}
                                        className="shrink-0"
                                    >
                                        {copiedStates.password ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>URL de Acceso</Label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 p-3 bg-muted rounded-md font-mono">
                                    {typeof window !== 'undefined' ? window.location.origin : ''}/agente
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/agente`, 'url')}
                                    className="shrink-0"
                                >
                                    {copiedStates.url ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Importante:</strong> Estas credenciales son temporales.
                                El agente debe cambiar su contraseña en el primer inicio de sesión.
                            </p>
                        </div>

                        {/* Botón para copiar todas las credenciales */}
                        <div className="pt-4 border-t">
                            <Button
                                onClick={copyAllCredentials}
                                className="w-full"
                                variant="default"
                            >
                                {copiedStates.all ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4 text-white" />
                                        Credenciales Copiadas
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copiar Todas las Credenciales
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Copia todas las credenciales en formato listo para compartir
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/agents">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nuevo Agente</h1>
                    <p className="text-muted-foreground">
                        Crea un nuevo agente comercial para el sistema
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Información Personal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>
                                Datos básicos del agente comercial
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre Completo *</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="juan@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    placeholder="+52 55 1234 5678"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="activo">Estado</Label>
                                    <p className="text-sm text-muted-foreground">
                                        El agente está activo y puede recibir leads
                                    </p>
                                </div>
                                <Switch
                                    id="activo"
                                    checked={formData.activo}
                                    onCheckedChange={(checked: boolean) => handleInputChange('activo', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuración Comercial */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración Comercial</CardTitle>
                            <CardDescription>
                                Parámetros de rendimiento y comisiones
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="metaMensualLeads">Meta Mensual de Leads</Label>
                                <Input
                                    id="metaMensualLeads"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={formData.metaMensualLeads}
                                    onChange={(e) => handleInputChange('metaMensualLeads', parseInt(e.target.value) || 0)}
                                    placeholder="20"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Número de leads que debe gestionar mensualmente
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comisionConversion">Comisión por Conversión</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="comisionConversion"
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={formData.comisionConversion}
                                        onChange={(e) => handleInputChange('comisionConversion', parseFloat(e.target.value) || 0)}
                                        placeholder="0.05"
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        ({Math.round(formData.comisionConversion * 100)}%)
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Porcentaje de comisión por cada conversión exitosa
                                </p>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Resumen de Configuración</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Meta mensual:</span>
                                        <span className="font-medium">{formData.metaMensualLeads} leads</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Comisión:</span>
                                        <span className="font-medium">{Math.round(formData.comisionConversion * 100)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estado:</span>
                                        <span className="font-medium">
                                            {formData.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/agents">Cancelar</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Creando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Crear Agente
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
