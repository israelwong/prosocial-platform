"use client";

import React from "react";
import { ZenCard } from "@/components/ui/zen";
import { AlertCircle, HardDrive } from "lucide-react";

interface StorageIndicatorProps {
    totalBytes: number;
    quotaLimitBytes: number;
    sectionMediaBytes?: number;
    categoryMediaBytes?: number;
    itemMediaBytes?: number;
    className?: string;
}

/**
 * Componente que muestra el uso de almacenamiento del studio
 * Incluye barra de progreso con colores según porcentaje
 * Verde: < 70%, Amarillo: 70-90%, Rojo: > 90%
 */
export function StorageIndicator({
    totalBytes,
    quotaLimitBytes,
    sectionMediaBytes = 0,
    categoryMediaBytes = 0,
    itemMediaBytes = 0,
    className = "",
}: StorageIndicatorProps) {
    // Calcular porcentaje
    const percentageUsed = (totalBytes / quotaLimitBytes) * 100;

    // Determinar color según porcentaje
    const getProgressColor = () => {
        if (percentageUsed > 90) return "bg-red-500";
        if (percentageUsed > 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getProgressBgColor = () => {
        if (percentageUsed > 90) return "bg-red-100";
        if (percentageUsed > 70) return "bg-yellow-100";
        return "bg-green-100";
    };

    // Formatear bytes a readable format (KB, MB, GB)
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const usedFormatted = formatBytes(totalBytes);
    const quotaFormatted = formatBytes(quotaLimitBytes);
    const percentageFormatted = Math.round(percentageUsed * 10) / 10;

    return (
        <ZenCard className={`p-4 ${className}`}>
            <div className="space-y-4">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-zinc-400" />
                        <h3 className="text-sm font-semibold text-zinc-200">
                            Almacenamiento
                        </h3>
                    </div>
                    {percentageUsed > 90 && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                </div>

                {/* Barra de progreso */}
                <div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${getProgressBgColor()}`}>
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
                            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Texto info */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                        {usedFormatted} / {quotaFormatted}
                    </span>
                    <span
                        className={`font-medium ${percentageUsed > 90
                                ? "text-red-400"
                                : percentageUsed > 70
                                    ? "text-yellow-400"
                                    : "text-green-400"
                            }`}
                    >
                        {percentageFormatted}%
                    </span>
                </div>

                {/* Breakdown por tipo (opcional) */}
                {(sectionMediaBytes > 0 || categoryMediaBytes > 0 || itemMediaBytes > 0) && (
                    <div className="pt-2 space-y-2 border-t border-zinc-800">
                        <div className="text-xs text-zinc-500 font-medium">Desglose:</div>
                        <div className="space-y-1 text-xs text-zinc-400">
                            {sectionMediaBytes > 0 && (
                                <div className="flex justify-between">
                                    <span>Secciones:</span>
                                    <span>{formatBytes(sectionMediaBytes)}</span>
                                </div>
                            )}
                            {categoryMediaBytes > 0 && (
                                <div className="flex justify-between">
                                    <span>Categorías:</span>
                                    <span>{formatBytes(categoryMediaBytes)}</span>
                                </div>
                            )}
                            {itemMediaBytes > 0 && (
                                <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span>{formatBytes(itemMediaBytes)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Advertencia si está cerca del límite */}
                {percentageUsed > 90 && (
                    <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-400">
                            ⚠️ Casi alcanzaste el límite de almacenamiento. Considera actualizar
                            tu plan.
                        </p>
                    </div>
                )}
            </div>
        </ZenCard>
    );
}
