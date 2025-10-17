"use client";

import React from "react";
import { ZenCard, ZenButton } from "@/components/ui/zen";
import { Plus, ChevronRight, Folder } from "lucide-react";
import { StorageIndicator } from "./StorageIndicator";

interface Seccion {
    id: string;
    name: string;
    order: number;
    createdAt: Date;
    categories?: Array<{ id: string; name: string }>;
    items?: number;
    mediaSize?: number;
}

interface SeccionesListViewProps {
    secciones: Seccion[];
    onSelectSeccion: (seccion: Seccion) => void;
    onCreateSeccion: () => void;
    storageUsage?: {
        totalBytes: number;
        quotaLimitBytes: number;
        sectionMediaBytes: number;
        categoryMediaBytes: number;
        itemMediaBytes: number;
    };
    isLoading?: boolean;
}

/**
 * Componente NIVEL 1 de navegación
 * Lista de todas las secciones del catálogo
 * Permite crear nueva sección y navegar a categorías
 */
export function SeccionesListView({
    secciones,
    onSelectSeccion,
    onCreateSeccion,
    storageUsage,
    isLoading = false,
}: SeccionesListViewProps) {
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Catálogo</h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Gestiona secciones, categorías e items
                    </p>
                </div>
                <ZenButton
                    onClick={onCreateSeccion}
                    variant="primary"
                    className="gap-2"
                    disabled={isLoading}
                >
                    <Plus className="w-4 h-4" />
                    Nueva Sección
                </ZenButton>
            </div>

            {/* Storage Indicator */}
            {storageUsage && (
                <StorageIndicator
                    totalBytes={storageUsage.totalBytes}
                    quotaLimitBytes={storageUsage.quotaLimitBytes}
                    sectionMediaBytes={storageUsage.sectionMediaBytes}
                    categoryMediaBytes={storageUsage.categoryMediaBytes}
                    itemMediaBytes={storageUsage.itemMediaBytes}
                />
            )}

            {/* Secciones Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-zinc-900 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : secciones.length === 0 ? (
                <ZenCard className="p-12 text-center">
                    <Folder className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">
                        Aún no tienes secciones. Crea tu primera sección.
                    </p>
                    <ZenButton
                        onClick={onCreateSeccion}
                        variant="primary"
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Sección
                    </ZenButton>
                </ZenCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {secciones.map((seccion) => (
                        <ZenCard
                            key={seccion.id}
                            className="p-4 hover:bg-zinc-800/80 cursor-pointer transition-colors"
                            onClick={() => onSelectSeccion(seccion)}
                        >
                            <div className="space-y-3">
                                {/* Encabezado con nombre */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-zinc-100 line-clamp-2">
                                            {seccion.name}
                                        </h3>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                                </div>

                                {/* Stats */}
                                <div className="space-y-1 text-xs text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Categorías:</span>
                                        <span className="font-medium">
                                            {seccion.categories?.length ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Items:</span>
                                        <span className="font-medium">{seccion.items ?? 0}</span>
                                    </div>
                                    {seccion.mediaSize && seccion.mediaSize > 0 && (
                                        <div className="flex justify-between">
                                            <span>Tamaño media:</span>
                                            <span className="font-medium">
                                                {formatBytes(seccion.mediaSize)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Pie de página */}
                                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-500">
                                    Creada{" "}
                                    {new Date(seccion.createdAt).toLocaleDateString("es-MX")}
                                </div>
                            </div>
                        </ZenCard>
                    ))}
                </div>
            )}

            {/* Resumen */}
            {secciones.length > 0 && (
                <div className="text-xs text-zinc-500 text-center">
                    Total: {secciones.length} sección{secciones.length !== 1 ? "es" : ""}
                </div>
            )}
        </div>
    );
}
