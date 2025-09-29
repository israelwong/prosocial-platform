'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Settings, Layers } from 'lucide-react';
import {
    ZenButton,
    ZenBadge,
    ZenCard,
    ZenCardContent,
} from '@/components/ui/zen';
import { SeccionCard } from './SeccionCard';
import { SeccionesModal } from './SeccionesModal';
import { CategoriasModal } from './CategoriasModal';
import { ServicioForm } from './ServicioForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { SearchBar } from './SearchBar';
import {
    obtenerCatalogo,
    actualizarPosicionCatalogo,
    duplicarServicio,
    eliminarSeccion,
    eliminarCategoria,
    eliminarServicio,
} from '@/lib/actions/studio/config/catalogo.actions';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type {
    SeccionData,
    CategoriaData,
    ServicioData,
} from '@/lib/actions/schemas/catalogo-schemas';

interface CatalogoListProps {
    studioSlug: string;
    initialCatalogo: SeccionData[];
    onCatalogoChange: (catalogo: SeccionData[]) => void;
}

export function CatalogoList({
    studioSlug,
    initialCatalogo,
    onCatalogoChange,
}: CatalogoListProps) {
    const [catalogo, setCatalogo] = useState<SeccionData[]>(initialCatalogo);
    const [isSeccionesModalOpen, setIsSeccionesModalOpen] = useState(false);
    const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
    const [isServicioFormOpen, setIsServicioFormOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<ServicioData | null>(null);
    const [editingSeccion, setEditingSeccion] = useState<SeccionData | null>(null);
    const [editingCategoria, setEditingCategoria] = useState<CategoriaData | null>(null);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);

    // Estados para modales de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<'seccion' | 'categoria' | 'servicio' | null>(null);
    const [deleteItem, setDeleteItem] = useState<{ id: string; nombre: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados para búsqueda
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrar catálogo según búsqueda
    const catalogoFiltrado = useCallback(() => {
        if (!searchQuery.trim()) {
            return catalogo;
        }

        const query = searchQuery.toLowerCase();
        const seccionesFiltradas: SeccionData[] = [];

        catalogo.forEach((seccion) => {
            const seccionCoincide = seccion.nombre.toLowerCase().includes(query) ||
                seccion.descripcion?.toLowerCase().includes(query);

            const categoriasFiltradas: CategoriaData[] = [];

            seccion.categorias?.forEach((categoria) => {
                const categoriaCoincide = categoria.nombre.toLowerCase().includes(query);

                const serviciosFiltrados = categoria.servicios?.filter((servicio) =>
                    servicio.nombre.toLowerCase().includes(query) ||
                    servicio.tipo_utilidad.toLowerCase().includes(query)
                ) || [];

                // Incluir categoría si coincide o tiene servicios que coinciden
                if (categoriaCoincide || serviciosFiltrados.length > 0) {
                    categoriasFiltradas.push({
                        ...categoria,
                        servicios: serviciosFiltrados.length > 0 ? serviciosFiltrados : categoria.servicios || [],
                    });
                }
            });

            // Incluir sección si coincide o tiene categorías/servicios que coinciden
            if (seccionCoincide || categoriasFiltradas.length > 0) {
                seccionesFiltradas.push({
                    ...seccion,
                    categorias: categoriasFiltradas.length > 0 ? categoriasFiltradas : seccion.categorias || [],
                });
            }
        });

        return seccionesFiltradas;
    }, [catalogo, searchQuery]);

    const catalogoParaMostrar = catalogoFiltrado();

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Evita activación accidental
            },
        })
    );

    // Sincronizar catálogo local con las props del padre
    useEffect(() => {
        setCatalogo(initialCatalogo);
    }, [initialCatalogo]);

    // Función para actualizar catálogo tanto local como en el padre
    const updateCatalogo = useCallback(
        (newCatalogo: SeccionData[]) => {
            setCatalogo(newCatalogo);
            onCatalogoChange(newCatalogo);
        },
        [onCatalogoChange]
    );

    // Función para recargar datos desde el servidor
    const recargarCatalogo = useCallback(async () => {
        try {
            const result = await obtenerCatalogo(studioSlug);
            if (result.success && result.data) {
                updateCatalogo(result.data);
            }
        } catch (error) {
            console.error('Error recargando catálogo:', error);
        }
    }, [studioSlug, updateCatalogo]);

    // Manejar drag & drop
    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over || !active) return;

            const activeId = String(active.id);
            const overId = String(over.id);

            if (activeId === overId) return;

            // Determinar tipo de elemento arrastrado
            const activeData = active.data.current;
            const overData = over.data.current;

            if (!activeData) return;

            const itemType = activeData.type as 'seccion' | 'categoria' | 'servicio';

            // Determinar índice destino y parentId
            let newIndex = 0;
            let parentId: string | null = null;

            if (itemType === 'seccion') {
                // Reordenar secciones
                const activeIndex = catalogo.findIndex((s) => s.id === activeId);
                const overIndex = catalogo.findIndex((s) => s.id === overId);
                newIndex = overIndex;
            } else if (itemType === 'categoria') {
                // Mover categoría entre secciones o reordenar
                if (overId.startsWith('seccion-empty-')) {
                    // Drop en sección vacía
                    parentId = overId.replace('seccion-empty-', '');
                    newIndex = 0;
                } else if (overData?.type === 'categoria') {
                    // Drop sobre otra categoría
                    const targetCategoria = overData.categoria as CategoriaData;
                    parentId = targetCategoria.seccionId || null;

                    // Encontrar índice en la sección destino
                    const seccionDestino = catalogo.find(s => s.id === parentId);
                    if (seccionDestino) {
                        newIndex = seccionDestino.categorias.findIndex(c => c.id === overId);
                    }
                }
            } else if (itemType === 'servicio') {
                // Mover servicio entre categorías o reordenar
                if (overId.startsWith('categoria-empty-')) {
                    // Drop en categoría vacía
                    parentId = overId.replace('categoria-empty-', '');
                    newIndex = 0;
                } else if (overData?.type === 'servicio') {
                    // Drop sobre otro servicio
                    const targetServicio = overData.servicio as ServicioData;
                    parentId = targetServicio.servicioCategoriaId;

                    // Encontrar índice en la categoría destino
                    for (const seccion of catalogo) {
                        const categoria = seccion.categorias.find(c => c.id === parentId);
                        if (categoria) {
                            newIndex = categoria.servicios.findIndex(s => s.id === overId);
                            break;
                        }
                    }
                }
            }

            // Guardar estado original para rollback
            const originalCatalogo = [...catalogo];

            try {
                // Actualizar en el backend
                const result = await actualizarPosicionCatalogo(
                    studioSlug,
                    activeId,
                    itemType,
                    newIndex,
                    parentId
                );

                if (result.success) {
                    // Recargar catálogo completo del servidor
                    await recargarCatalogo();
                    toast.success('Orden actualizado exitosamente');
                } else {
                    toast.error(result.error || 'Error al actualizar el orden');
                    setCatalogo(originalCatalogo);
                }
            } catch (error) {
                console.error('Error updating position:', error);
                toast.error('Error al actualizar la posición');
                setCatalogo(originalCatalogo);
            }
        },
        [catalogo, studioSlug, recargarCatalogo]
    );

    // Handlers de eventos
    const handleEditSeccion = (seccion: SeccionData) => {
        setEditingSeccion(seccion);
        setIsSeccionesModalOpen(true);
    };

    const handleDeleteSeccion = (seccion: SeccionData) => {
        setDeleteType('seccion');
        setDeleteItem({ id: seccion.id, nombre: seccion.nombre });
        setIsDeleteModalOpen(true);
    };

    const handleAddCategoria = (seccionId: string) => {
        setSelectedCategoriaId(seccionId);
        setEditingCategoria(null);
        setIsCategoriasModalOpen(true);
    };

    const handleEditCategoria = (categoria: CategoriaData) => {
        setEditingCategoria(categoria);
        setIsCategoriasModalOpen(true);
    };

    const handleDeleteCategoria = (categoria: CategoriaData) => {
        setDeleteType('categoria');
        setDeleteItem({ id: categoria.id, nombre: categoria.nombre });
        setIsDeleteModalOpen(true);
    };

    const handleAddServicio = (categoriaId: string) => {
        setSelectedCategoriaId(categoriaId);
        setEditingServicio(null);
        setIsServicioFormOpen(true);
    };

    const handleEditServicio = (servicio: ServicioData) => {
        setEditingServicio(servicio);
        setSelectedCategoriaId(servicio.servicioCategoriaId);
        setIsServicioFormOpen(true);
    };

    const handleDeleteServicio = (servicio: ServicioData) => {
        setDeleteType('servicio');
        setDeleteItem({ id: servicio.id, nombre: servicio.nombre });
        setIsDeleteModalOpen(true);
    };

    const handleDuplicateServicio = async (servicioId: string) => {
        try {
            const result = await duplicarServicio(studioSlug, servicioId);
            if (result.success) {
                toast.success('Servicio duplicado exitosamente');
                await recargarCatalogo();
            } else {
                toast.error(result.error || 'Error al duplicar servicio');
            }
        } catch (error) {
            console.error('Error duplicando servicio:', error);
            toast.error('Error al duplicar servicio');
        }
    };

    const handleServicioFormSuccess = () => {
        setIsServicioFormOpen(false);
        setEditingServicio(null);
        setSelectedCategoriaId(null);
        recargarCatalogo();
    };

    const handleServicioFormClose = () => {
        setIsServicioFormOpen(false);
        setEditingServicio(null);
        setSelectedCategoriaId(null);
    };

    const handleSeccionesModalClose = () => {
        setIsSeccionesModalOpen(false);
        setEditingSeccion(null);
    };

    const handleSeccionesModalSuccess = () => {
        setIsSeccionesModalOpen(false);
        setEditingSeccion(null);
        recargarCatalogo();
    };

    const handleCategoriasModalClose = () => {
        setIsCategoriasModalOpen(false);
        setEditingCategoria(null);
        setSelectedCategoriaId(null);
    };

    const handleCategoriasModalSuccess = () => {
        setIsCategoriasModalOpen(false);
        setEditingCategoria(null);
        setSelectedCategoriaId(null);
        recargarCatalogo();
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem || !deleteType) return;

        setIsDeleting(true);
        try {
            let result;

            switch (deleteType) {
                case 'seccion':
                    result = await eliminarSeccion(studioSlug, deleteItem.id);
                    break;
                case 'categoria':
                    result = await eliminarCategoria(studioSlug, deleteItem.id);
                    break;
                case 'servicio':
                    result = await eliminarServicio(studioSlug, deleteItem.id);
                    break;
            }

            if (result?.success) {
                const typeLabel = {
                    seccion: 'Sección',
                    categoria: 'Categoría',
                    servicio: 'Servicio',
                }[deleteType];

                toast.success(`${typeLabel} eliminada exitosamente`);
                setIsDeleteModalOpen(false);
                setDeleteItem(null);
                setDeleteType(null);
                await recargarCatalogo();
            } else {
                toast.error(result?.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error eliminando:', error);
            toast.error('Error al eliminar');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
        setDeleteType(null);
    };

    // Calcular totales
    const totalCategorias = catalogo.reduce(
        (acc, s) => acc + s.categorias.length,
        0
    );
    const totalServicios = catalogo.reduce(
        (acc, s) =>
            acc + s.categorias.reduce((a, c) => a + c.servicios.length, 0),
        0
    );

    return (
        <div className="space-y-6">
            {/* Header con botones de gestión */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="h-6 w-6 text-blue-400" />
                    <div className="flex items-center gap-2">
                        <ZenBadge variant="secondary">
                            {catalogo.length} sección{catalogo.length !== 1 ? 'es' : ''}
                        </ZenBadge>
                        <ZenBadge variant="outline">
                            {totalCategorias} categoría{totalCategorias !== 1 ? 's' : ''}
                        </ZenBadge>
                        <ZenBadge variant="outline">
                            {totalServicios} servicio{totalServicios !== 1 ? 's' : ''}
                        </ZenBadge>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Botón Gestionar Secciones */}
                    <ZenButton
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setIsSeccionesModalOpen(true)}
                    >
                        <Settings className="h-4 w-4" />
                        Secciones
                    </ZenButton>

                    {/* Botón Gestionar Categorías */}
                    <ZenButton
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setIsCategoriasModalOpen(true)}
                    >
                        <Settings className="h-4 w-4" />
                        Categorías
                    </ZenButton>
                </div>
            </div>

            {/* Barra de búsqueda */}
            <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar por nombre de servicio, categoría o sección..."
            />

            {/* Indicador de resultados de búsqueda */}
            {searchQuery && (
                <div className="flex items-center justify-between px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <span className="text-sm text-blue-400">
                        📊 Mostrando {catalogoParaMostrar.reduce((acc, s) =>
                            acc + s.categorias.reduce((a, c) => a + c.servicios.length, 0), 0
                        )} servicio(s) de {totalServicios} total
                    </span>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            )}

            {/* Lista de secciones con drag & drop */}
            {catalogoParaMostrar.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={catalogoParaMostrar.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-6">
                            {catalogoParaMostrar.map((seccion) => (
                                <SeccionCard
                                    key={seccion.id}
                                    seccion={seccion}
                                    onEdit={handleEditSeccion}
                                    onDelete={handleDeleteSeccion}
                                    onAddCategoria={handleAddCategoria}
                                    onEditCategoria={handleEditCategoria}
                                    onDeleteCategoria={handleDeleteCategoria}
                                    onAddServicio={handleAddServicio}
                                    onEditServicio={handleEditServicio}
                                    onDeleteServicio={handleDeleteServicio}
                                    onDuplicateServicio={handleDuplicateServicio}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <ZenCard>
                    <ZenCardContent className="text-center py-12">
                        <Layers className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            No hay secciones en el catálogo
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Comienza creando secciones para organizar tus servicios
                        </p>
                        <ZenButton
                            variant="primary"
                            onClick={() => setIsSeccionesModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Crear Primera Sección
                        </ZenButton>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Modales */}
            <SeccionesModal
                isOpen={isSeccionesModalOpen}
                onClose={handleSeccionesModalClose}
                onSuccess={handleSeccionesModalSuccess}
                studioSlug={studioSlug}
                editingSeccion={editingSeccion}
            />

            <CategoriasModal
                isOpen={isCategoriasModalOpen}
                onClose={handleCategoriasModalClose}
                onSuccess={handleCategoriasModalSuccess}
                studioSlug={studioSlug}
                editingCategoria={editingCategoria}
            />

            <ServicioForm
                isOpen={isServicioFormOpen}
                onClose={handleServicioFormClose}
                onSuccess={handleServicioFormSuccess}
                studioSlug={studioSlug}
                servicio={editingServicio}
                categoriaId={selectedCategoriaId}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title={`Eliminar ${deleteType === 'seccion' ? 'Sección' :
                    deleteType === 'categoria' ? 'Categoría' : 'Servicio'
                    }`}
                message={`¿Estás seguro de que deseas eliminar ${deleteType === 'seccion' ? 'esta sección' :
                    deleteType === 'categoria' ? 'esta categoría' : 'este servicio'
                    }? ${deleteType === 'seccion' ? 'Se eliminarán también todas las categorías y servicios asociados.' :
                        deleteType === 'categoria' ? 'Se eliminarán también todos los servicios asociados.' : ''
                    }`}
                itemName={deleteItem?.nombre}
                loading={isDeleting}
            />
        </div>
    );
}
