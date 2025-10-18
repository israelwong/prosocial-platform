"use client";

import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { ZenCard } from "@/components/ui/zen";

interface Item {
    id: string;
    name: string;
    cost?: number;
    mediaSize?: number;
    isNew?: boolean;
    isFeatured?: boolean;
}

interface ItemCardProps {
    item: Item;
    onEdit: (item: Item) => void;
    onDelete: (item: Item) => void;
    precioPublico?: number;
}

/**
 * Tarjeta de Item con drag handle, nombre, precio calculado y acciones
 * Utilizable en cualquier vista de lista de items
 */
export function ItemCard({ item, onEdit, onDelete, precioPublico }: ItemCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: {
            type: "item",
            item,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const cardElement = document.querySelector(`.card-${item.id}`);
            if (cardElement && !cardElement.contains(target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [item.id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Usar precio público calculado si está disponible, sino usar el costo
    const displayPrice = precioPublico !== undefined ? precioPublico : (item.cost || 0);

    return (
        <div ref={setNodeRef} style={style} className="group">
            <ZenCard className={`p-2 hover:bg-zinc-800/80 transition-colors card-${item.id}`}>
                <div className="flex items-center gap-2">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 flex-shrink-0"
                        aria-label="Arrastrar item"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>

                    {/* Nombre del item */}
                    <span className="text-sm text-zinc-200 flex-1 min-w-0">
                        {item.name}
                    </span>

                    {/* Precio público calculado */}
                    <div className="text-sm font-semibold text-zinc-100 min-w-[80px] text-right flex-shrink-0">
                        {formatCurrency(displayPrice)}
                    </div>

                    {/* Botón de menú */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
                            title="Opciones"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Menú desplegable */}
                        {menuOpen && (
                            <div className={`absolute top-full right-0 mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 py-1 card-${item.id}`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(item);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors text-left"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
