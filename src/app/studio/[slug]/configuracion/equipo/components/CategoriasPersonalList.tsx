'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import {
    ZenButton,
    ZenCard,
    ZenCardContent,
    ZenBadge
} from '@/components/ui/zen';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/shadcn/dialog';
import { CategoriaPersonalForm } from './CategoriaPersonalForm';
import { CategoriaPersonalItem } from './CategoriaPersonalItem';
import {
    obtenerCategoriasPersonal,
    eliminarCategoriaPersonal
} from '@/lib/actions/studio/config/personal.actions';
import type { CategoriaPersonalData } from '@/lib/actions/schemas/personal-schemas';

interface CategoriasPersonalListProps {
    studioSlug: string;
}

export function CategoriasPersonalList({ studioSlug }: CategoriasPersonalListProps) {
    const [categorias, setCategorias] = useState<CategoriaPersonalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<CategoriaPersonalData | null>(null);

    const cargarCategorias = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerCategoriasPersonal(studioSlug);

            if (result.success && result.data) {
                setCategorias(result.data);
            } else {
                toast.error(result.error || 'Error al cargar categorías');
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            toast.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    const handleEliminar = async (categoriaId: string) => {
        try {
            const result = await eliminarCategoriaPersonal(studioSlug, categoriaId);
            if (result.success) {
                toast.success('Categoría eliminada exitosamente');
                cargarCategorias();
            } else {
                toast.error(result.error || 'Error al eliminar categoría');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar categoría');
        }
    };

    const handleEdit = (categoria: CategoriaPersonalData) => {
        setEditingCategoria(categoria);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingCategoria(null);
        cargarCategorias();
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingCategoria(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-zinc-400">Cargando categorías...</div>
            </div>
        );
    }

    // Agrupar categorías por tipo
    const categoriasOperativas = categorias.filter(c => c.tipo === 'OPERATIVO');
    const categoriasAdministrativas = categorias.filter(c => c.tipo === 'ADMINISTRATIVO');
    const categoriasProveedores = categorias.filter(c => c.tipo === 'PROVEEDOR');

    return (
        <div className="space-y-6">
            {/* Header con botón de agregar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Categorías de Personal</h3>
                    <p className="text-sm text-zinc-400">
                        Gestiona las categorías y roles de tu equipo
                    </p>
                </div>
                <ZenButton
                    variant="primary"
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Categoría
                </ZenButton>
            </div>

            {/* Categorías Operativas */}
            {categoriasOperativas.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ZenBadge variant="default" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                            Operativo
                        </ZenBadge>
                        <span className="text-sm text-zinc-400">
                            {categoriasOperativas.length} categoría{categoriasOperativas.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid gap-3">
                        {categoriasOperativas.map((categoria) => (
                            <CategoriaPersonalItem
                                key={categoria.id}
                                categoria={categoria}
                                onEdit={handleEdit}
                                onDelete={handleEliminar}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Categorías Administrativas */}
            {categoriasAdministrativas.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ZenBadge variant="default" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                            Administrativo
                        </ZenBadge>
                        <span className="text-sm text-zinc-400">
                            {categoriasAdministrativas.length} categoría{categoriasAdministrativas.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid gap-3">
                        {categoriasAdministrativas.map((categoria) => (
                            <CategoriaPersonalItem
                                key={categoria.id}
                                categoria={categoria}
                                onEdit={handleEdit}
                                onDelete={handleEliminar}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Categorías Proveedores */}
            {categoriasProveedores.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ZenBadge variant="default" className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                            Proveedor
                        </ZenBadge>
                        <span className="text-sm text-zinc-400">
                            {categoriasProveedores.length} categoría{categoriasProveedores.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid gap-3">
                        {categoriasProveedores.map((categoria) => (
                            <CategoriaPersonalItem
                                key={categoria.id}
                                categoria={categoria}
                                onEdit={handleEdit}
                                onDelete={handleEliminar}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {categorias.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">No hay categorías de personal</div>
                    <ZenButton
                        variant="outline"
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Crear Primera Categoría
                    </ZenButton>
                </div>
            )}

            {/* Modal de formulario */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                        </DialogTitle>
                    </DialogHeader>
                    <CategoriaPersonalForm
                        studioSlug={studioSlug}
                        categoria={editingCategoria}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormClose}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
