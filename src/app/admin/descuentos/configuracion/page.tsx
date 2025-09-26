"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Switch } from "@/components/ui/shadcn/switch";
import { Badge } from "@/components/ui/shadcn/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select";
import {
    Settings,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface ConfiguracionDescuentos {
    // Configuración general
    descuentosHabilitados: boolean;
    descuentoMaximoPorcentaje: number;
    descuentoMaximoMonto: number;

    // Configuración de agentes
    agentesPuedenGenerar: boolean;
    codigoBaseAgentes: string;
    duracionPorDefecto: "1_mes" | "3_meses" | "permanente";
    descuentoMaximoAgente: number;

    // Configuración de Stripe
    sincronizacionAutomatica: boolean;
    webhookStripe: string;
    apiKeyStripe: string;

    // Configuración de notificaciones
    notificarUso: boolean;
    notificarExpiracion: boolean;
    notificarAgentes: boolean;

    // Configuración de límites
    maxCodigosPorAgente: number;
    maxCodigosPorDia: number;
    diasAntesExpiracion: number;

    // Plantillas
    plantillaEmail: string;
    plantillaSms: string;
}

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(false);
    const [configuracion, setConfiguracion] = useState<ConfiguracionDescuentos>({
        // Configuración general
        descuentosHabilitados: true,
        descuentoMaximoPorcentaje: 50,
        descuentoMaximoMonto: 1000,

        // Configuración de agentes
        agentesPuedenGenerar: true,
        codigoBaseAgentes: "DEMO",
        duracionPorDefecto: "permanente",
        descuentoMaximoAgente: 25,

        // Configuración de Stripe
        sincronizacionAutomatica: true,
        webhookStripe: "",
        apiKeyStripe: "",

        // Configuración de notificaciones
        notificarUso: true,
        notificarExpiracion: true,
        notificarAgentes: true,

        // Configuración de límites
        maxCodigosPorAgente: 100,
        maxCodigosPorDia: 50,
        diasAntesExpiracion: 7,

        // Plantillas
        plantillaEmail: "Hola {lead_nombre}, tienes un descuento especial del {descuento}% con el código {codigo}. ¡Aprovecha esta oferta!",
        plantillaSms: "¡Descuento especial! Usa el código {codigo} y obtén {descuento}% de descuento. Válido hasta {fecha_expiracion}."
    });

    const handleInputChange = (field: keyof ConfiguracionDescuentos, value: any) => {
        setConfiguracion(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            // TODO: Implementar guardado en la API
            console.log("Saving configuration:", configuracion);

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success("Configuración guardada exitosamente");
        } catch (error) {
            toast.error("Error al guardar la configuración");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestStripe = async () => {
        setLoading(true);

        try {
            // TODO: Implementar test de conexión con Stripe
            console.log("Testing Stripe connection...");

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success("Conexión con Stripe exitosa");
        } catch (error) {
            toast.error("Error al conectar con Stripe");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Configuración de Descuentos</h2>
                    <p className="text-muted-foreground">
                        Configura el sistema de descuentos y promociones
                    </p>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar Configuración"}
                </Button>
            </div>

            {/* Configuración General */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configuración General
                    </CardTitle>
                    <CardDescription>
                        Configuración básica del sistema de descuentos
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Descuentos Habilitados</Label>
                            <p className="text-sm text-muted-foreground">
                                Activar o desactivar el sistema de descuentos
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.descuentosHabilitados}
                            onCheckedChange={(checked) => handleInputChange("descuentosHabilitados", checked)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="descuentoMaximoPorcentaje">Descuento Máximo (%)</Label>
                            <Input
                                id="descuentoMaximoPorcentaje"
                                type="number"
                                value={configuracion.descuentoMaximoPorcentaje}
                                onChange={(e) => handleInputChange("descuentoMaximoPorcentaje", parseInt(e.target.value))}
                                min="1"
                                max="100"
                            />
                            <p className="text-sm text-muted-foreground">
                                Porcentaje máximo permitido para descuentos
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descuentoMaximoMonto">Descuento Máximo ($)</Label>
                            <Input
                                id="descuentoMaximoMonto"
                                type="number"
                                value={configuracion.descuentoMaximoMonto}
                                onChange={(e) => handleInputChange("descuentoMaximoMonto", parseInt(e.target.value))}
                                min="1"
                            />
                            <p className="text-sm text-muted-foreground">
                                Monto máximo permitido para descuentos fijos
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Configuración de Agentes */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Agentes</CardTitle>
                    <CardDescription>
                        Configuración para códigos generados por agentes
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Agentes Pueden Generar Códigos</Label>
                            <p className="text-sm text-muted-foreground">
                                Permitir que los agentes generen códigos personalizados
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.agentesPuedenGenerar}
                            onCheckedChange={(checked) => handleInputChange("agentesPuedenGenerar", checked)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="codigoBaseAgentes">Código Base para Agentes</Label>
                            <Input
                                id="codigoBaseAgentes"
                                value={configuracion.codigoBaseAgentes}
                                onChange={(e) => handleInputChange("codigoBaseAgentes", e.target.value.toUpperCase())}
                                placeholder="DEMO"
                                className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                                Prefijo para códigos generados por agentes
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Duración por Defecto</Label>
                            <Select
                                value={configuracion.duracionPorDefecto}
                                onValueChange={(value: "1_mes" | "3_meses" | "permanente") =>
                                    handleInputChange("duracionPorDefecto", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1_mes">1 mes</SelectItem>
                                    <SelectItem value="3_meses">3 meses</SelectItem>
                                    <SelectItem value="permanente">Permanente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descuentoMaximoAgente">Descuento Máximo para Agentes (%)</Label>
                        <Input
                            id="descuentoMaximoAgente"
                            type="number"
                            value={configuracion.descuentoMaximoAgente}
                            onChange={(e) => handleInputChange("descuentoMaximoAgente", parseInt(e.target.value))}
                            min="1"
                            max="100"
                        />
                        <p className="text-sm text-muted-foreground">
                            Porcentaje máximo que pueden ofrecer los agentes
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Configuración de Stripe */}
            <Card>
                <CardHeader>
                    <CardTitle>Integración con Stripe</CardTitle>
                    <CardDescription>
                        Configuración para sincronización con Stripe
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Sincronización Automática</Label>
                            <p className="text-sm text-muted-foreground">
                                Crear cupones automáticamente en Stripe
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.sincronizacionAutomatica}
                            onCheckedChange={(checked) => handleInputChange("sincronizacionAutomatica", checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="webhookStripe">Webhook de Stripe</Label>
                        <Input
                            id="webhookStripe"
                            value={configuracion.webhookStripe}
                            onChange={(e) => handleInputChange("webhookStripe", e.target.value)}
                            placeholder="https://api.stripe.com/v1/webhooks/..."
                        />
                        <p className="text-sm text-muted-foreground">
                            URL del webhook para recibir eventos de Stripe
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apiKeyStripe">API Key de Stripe</Label>
                        <Input
                            id="apiKeyStripe"
                            type="password"
                            value={configuracion.apiKeyStripe}
                            onChange={(e) => handleInputChange("apiKeyStripe", e.target.value)}
                            placeholder="sk_test_..."
                        />
                        <p className="text-sm text-muted-foreground">
                            Clave API para autenticación con Stripe
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleTestStripe} disabled={loading}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Probar Conexión
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Configurar Webhooks
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Configuración de Notificaciones */}
            <Card>
                <CardHeader>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>
                        Configuración de notificaciones automáticas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Notificar Uso de Códigos</Label>
                            <p className="text-sm text-muted-foreground">
                                Enviar notificación cuando se use un código
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.notificarUso}
                            onCheckedChange={(checked) => handleInputChange("notificarUso", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Notificar Próxima Expiración</Label>
                            <p className="text-sm text-muted-foreground">
                                Enviar alerta antes de que expire un código
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.notificarExpiracion}
                            onCheckedChange={(checked) => handleInputChange("notificarExpiracion", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Notificar a Agentes</Label>
                            <p className="text-sm text-muted-foreground">
                                Enviar notificaciones a agentes sobre sus códigos
                            </p>
                        </div>
                        <Switch
                            checked={configuracion.notificarAgentes}
                            onCheckedChange={(checked) => handleInputChange("notificarAgentes", checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Configuración de Límites */}
            <Card>
                <CardHeader>
                    <CardTitle>Límites y Restricciones</CardTitle>
                    <CardDescription>
                        Configuración de límites para el sistema
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="maxCodigosPorAgente">Máx. Códigos por Agente</Label>
                            <Input
                                id="maxCodigosPorAgente"
                                type="number"
                                value={configuracion.maxCodigosPorAgente}
                                onChange={(e) => handleInputChange("maxCodigosPorAgente", parseInt(e.target.value))}
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxCodigosPorDia">Máx. Códigos por Día</Label>
                            <Input
                                id="maxCodigosPorDia"
                                type="number"
                                value={configuracion.maxCodigosPorDia}
                                onChange={(e) => handleInputChange("maxCodigosPorDia", parseInt(e.target.value))}
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="diasAntesExpiracion">Días antes de Expiración</Label>
                            <Input
                                id="diasAntesExpiracion"
                                type="number"
                                value={configuracion.diasAntesExpiracion}
                                onChange={(e) => handleInputChange("diasAntesExpiracion", parseInt(e.target.value))}
                                min="1"
                                max="30"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Plantillas */}
            <Card>
                <CardHeader>
                    <CardTitle>Plantillas de Comunicación</CardTitle>
                    <CardDescription>
                        Plantillas para emails y SMS automáticos
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="plantillaEmail">Plantilla de Email</Label>
                        <Textarea
                            id="plantillaEmail"
                            value={configuracion.plantillaEmail}
                            onChange={(e) => handleInputChange("plantillaEmail", e.target.value)}
                            rows={3}
                            placeholder="Hola {lead_nombre}, tienes un descuento especial..."
                        />
                        <p className="text-sm text-muted-foreground">
                            Variables disponibles: {`{lead_nombre}, {descuento}, {codigo}, {fecha_expiracion}`}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="plantillaSms">Plantilla de SMS</Label>
                        <Textarea
                            id="plantillaSms"
                            value={configuracion.plantillaSms}
                            onChange={(e) => handleInputChange("plantillaSms", e.target.value)}
                            rows={2}
                            placeholder="¡Descuento especial! Usa el código..."
                        />
                        <p className="text-sm text-muted-foreground">
                            Variables disponibles: {`{lead_nombre}, {descuento}, {codigo}, {fecha_expiracion}`}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Estado del Sistema</CardTitle>
                    <CardDescription>
                        Verificación del estado de los componentes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>Sistema de Descuentos</span>
                            </div>
                            <Badge variant="default">Activo</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>Base de Datos</span>
                            </div>
                            <Badge variant="default">Conectado</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <span>Stripe Integration</span>
                            </div>
                            <Badge variant="secondary">Pendiente</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>Notificaciones</span>
                            </div>
                            <Badge variant="default">Configurado</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
