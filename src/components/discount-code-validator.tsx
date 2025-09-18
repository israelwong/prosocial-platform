"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    XCircle,
    Percent,
    DollarSign,
    Calendar,
    Users,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface DiscountCodeInfo {
    id: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    tipo_descuento: "porcentaje" | "monto_fijo";
    valor_descuento: number;
    tipo_aplicacion: "plan_mensual" | "plan_anual" | "ambos";
    fecha_inicio: string;
    fecha_fin: string;
    uso_maximo?: number;
    uso_actual: number;
    activo: boolean;
    valid: boolean;
    reason?: string;
}

interface DiscountCodeValidatorProps {
    onCodeValidated?: (code: DiscountCodeInfo) => void;
    onCodeApplied?: (code: DiscountCodeInfo) => void;
    planType?: "plan_mensual" | "plan_anual";
    disabled?: boolean;
}

export function DiscountCodeValidator({
    onCodeValidated,
    onCodeApplied,
    planType,
    disabled = false,
}: DiscountCodeValidatorProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [validatedCode, setValidatedCode] = useState<DiscountCodeInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateCode = async () => {
        if (!code.trim()) {
            setError("Por favor ingresa un código de descuento");
            return;
        }

        setLoading(true);
        setError(null);
        setValidatedCode(null);

        try {
            const response = await fetch("/api/discount-codes/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    codigo: code.trim().toUpperCase(),
                    planType,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setValidatedCode(data.data);
                onCodeValidated?.(data.data);
                toast.success("Código de descuento válido");
            } else {
                setError(data.error || "Código de descuento inválido");
                toast.error(data.error || "Código de descuento inválido");
            }
        } catch (error) {
            console.error("Error validating discount code:", error);
            setError("Error al validar el código de descuento");
            toast.error("Error al validar el código de descuento");
        } finally {
            setLoading(false);
        }
    };

    const applyCode = async () => {
        if (!validatedCode) return;

        setLoading(true);

        try {
            const response = await fetch("/api/discount-codes/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    codigo: validatedCode.codigo,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onCodeApplied?.(validatedCode);
                toast.success("Código de descuento aplicado exitosamente");
            } else {
                setError(data.error || "Error al aplicar el código de descuento");
                toast.error(data.error || "Error al aplicar el código de descuento");
            }
        } catch (error) {
            console.error("Error applying discount code:", error);
            setError("Error al aplicar el código de descuento");
            toast.error("Error al aplicar el código de descuento");
        } finally {
            setLoading(false);
        }
    };

    const clearCode = () => {
        setCode("");
        setValidatedCode(null);
        setError(null);
    };

    const getDiscountDisplay = (code: DiscountCodeInfo) => {
        if (code.tipo_descuento === "porcentaje") {
            return `${code.valor_descuento}%`;
        } else {
            return `$${code.valor_descuento}`;
        }
    };

    const getApplicationDisplay = (code: DiscountCodeInfo) => {
        switch (code.tipo_aplicacion) {
            case "plan_mensual":
                return "Plan Mensual";
            case "plan_anual":
                return "Plan Anual";
            case "ambos":
                return "Todos los planes";
            default:
                return "Todos los planes";
        }
    };

    const isCodeCompatible = (code: DiscountCodeInfo) => {
        if (!planType) return true;
        return code.tipo_aplicacion === "ambos" || code.tipo_aplicacion === planType;
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Código de Descuento</CardTitle>
                    <CardDescription>
                        Ingresa tu código de descuento para obtener una oferta especial
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="discount-code" className="sr-only">
                                Código de descuento
                            </Label>
                            <Input
                                id="discount-code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Ingresa tu código de descuento"
                                className="font-mono"
                                disabled={disabled || loading}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        validateCode();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            onClick={validateCode}
                            disabled={disabled || loading || !code.trim()}
                            variant="outline"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Validar"
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <XCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {validatedCode && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4" />
                                Código válido
                            </div>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-green-900">
                                                    {validatedCode.nombre}
                                                </h4>
                                                <p className="text-sm text-green-700">
                                                    {validatedCode.descripcion}
                                                </p>
                                            </div>
                                            <Badge variant="default" className="bg-green-600">
                                                {getDiscountDisplay(validatedCode)}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {validatedCode.tipo_descuento === "porcentaje" ? (
                                                    <Percent className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                )}
                                                <span className="text-green-700">
                                                    {getApplicationDisplay(validatedCode)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                                <span className="text-green-700">
                                                    Válido hasta {new Date(validatedCode.fecha_fin).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {validatedCode.uso_maximo && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-green-600" />
                                                <span className="text-green-700">
                                                    {validatedCode.uso_actual} de {validatedCode.uso_maximo} usos
                                                </span>
                                            </div>
                                        )}

                                        {!isCodeCompatible(validatedCode) && (
                                            <div className="flex items-center gap-2 text-amber-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                Este código no es compatible con el plan seleccionado
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button
                                    onClick={applyCode}
                                    disabled={disabled || loading || !isCodeCompatible(validatedCode)}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        "Aplicar Descuento"
                                    )}
                                </Button>
                                <Button
                                    onClick={clearCode}
                                    variant="outline"
                                    disabled={disabled || loading}
                                >
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
