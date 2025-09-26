'use client';

import React, { useState, useEffect } from 'react';
// Imports removidos - ahora se usan a través de HeaderNavigation
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { PersonalModal } from '../components/PersonalModal';
import { PersonalListSimple } from '../components/PersonalListSimple';
// import { PersonalStats } from '../components/PersonalStats'; // Removido porque no se usa
import {
    obtenerPersonalStudio,
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal,
    // obtenerEstadisticasPersonal, // Removido porque no se usa
} from '@/lib/actions/studio/config/personal.actions';
import {
    type PersonalCreateForm,
    type PersonalUpdateForm,
} from '@/lib/actions/schemas/personal-schemas';
import type { Personal, PersonalFromAPI } from '../types';

// Tipos específicos para los resultados de las acciones de la API
interface ApiProfessionalProfile {
    id: string;
    userId: string;
    profileId: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface ApiPersonalResult {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    type: import('@/lib/actions/schemas/personal-schemas').PersonnelType | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    professional_profiles: ApiProfessionalProfile[];
}

// Función para convertir PersonalFromAPI a Personal para compatibilidad con componentes
const convertPersonalFromAPI = (personalFromAPI: PersonalFromAPI): Personal => {
    return {
        ...personalFromAPI,
        professional_profiles: personalFromAPI.professional_profiles.map(pp => ({
            ...pp,
            profile: pp.profile ? {
                id: pp.profile.id || '',
                name: pp.profile.name || '',
                slug: pp.profile.slug || '',
                color: pp.profile.color || null,
                icon: pp.profile.icon || null,
                description: pp.profile.description || null,
                projectId: pp.profile.projectId || '',
                isActive: pp.profile.isActive ?? true,
                isDefault: pp.profile.isDefault ?? false,
                order: pp.profile.order || 0,
                createdAt: pp.profile.createdAt || new Date(),
                updatedAt: pp.profile.updatedAt || new Date(),
            } : null,
        })),
    };
};

// Función para convertir el resultado de las acciones de la API a PersonalFromAPI
const convertApiResultToPersonalFromAPI = (apiResult: ApiPersonalResult): PersonalFromAPI => {
    return {
        id: apiResult.id,
        fullName: apiResult.fullName,
        email: apiResult.email,
        phone: apiResult.phone,
        type: apiResult.type,
        isActive: apiResult.isActive,
        createdAt: apiResult.createdAt,
        updatedAt: apiResult.updatedAt,
        professional_profiles: (apiResult.professional_profiles || []).map((pp) => ({
            id: pp.id,
            profile: null, // Las funciones de API no incluyen el profile completo
            description: pp.description,
            isActive: pp.isActive,
        })),
    };
};

export default function EmpleadosPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [empleados, setEmpleados] = useState<PersonalFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState<PersonalFromAPI | null>(null);

    // Cargar empleados
    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);
            const personalData = await obtenerPersonalStudio(slug, { type: 'EMPLEADO' });
            setEmpleados(personalData);
        } catch (error) {
            console.error('Error loading empleados:', error);
            toast.error('Error al cargar la información de empleados');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Funciones del modal
    const handleOpenModal = (empleado?: PersonalFromAPI) => {
        setEditingEmpleado(empleado || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmpleado(null);
    };

    const handleSaveEmpleado = async (data: PersonalCreateForm | PersonalUpdateForm) => {
        setModalLoading(true);

        try {
            if (editingEmpleado) {
                // Actualizar empleado existente
                const empleadoActualizado = await actualizarPersonal(
                    slug,
                    editingEmpleado.id,
                    data as PersonalUpdateForm
                );

                // Actualizar localmente
                setEmpleados(prev =>
                    prev.map(emp =>
                        emp.id === editingEmpleado.id ? convertApiResultToPersonalFromAPI(empleadoActualizado) : emp
                    )
                );
                toast.success('Empleado actualizado exitosamente');
            } else {
                // Crear nuevo empleado
                const nuevoEmpleado = await crearPersonal(slug, {
                    ...data as PersonalCreateForm,
                    type: 'EMPLEADO', // Forzar tipo empleado
                });

                // Actualizar localmente
                setEmpleados(prev => [convertApiResultToPersonalFromAPI(nuevoEmpleado), ...prev]);
                toast.success('Empleado creado exitosamente');
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error saving empleado:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(errorMessage);
            throw error; // Re-throw para que el modal maneje el error
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteEmpleado = async (empleadoId: string, empleadoName: string) => {
        try {
            const result = await eliminarPersonal(slug, empleadoId);

            if (result.deleted) {
                // Actualizar localmente
                setEmpleados(prev => prev.filter(emp => emp.id !== empleadoId));
                toast.success(`${empleadoName} ha sido eliminado exitosamente`);
            }
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el empleado';
            toast.error(errorMessage);
        }
    };

    const navigateToPerfiles = () => {
        router.push(`/${slug}/configuracion/negocio/personal/perfiles`);
    };

    const handleToggleActive = async (empleadoId: string, isActive: boolean) => {
        try {
            // TODO: Implementar toggle de estado en el backend
            // Por ahora, solo actualizar localmente
            setEmpleados(prev =>
                prev.map(emp =>
                    emp.id === empleadoId ? { ...emp, isActive } : emp
                )
            );
            toast.success(`Empleado ${isActive ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error al cambiar estado del empleado:', error);
            toast.error('Error al cambiar el estado del empleado');
        }
    };



    return (
        <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">

            {/* Header de la sección */}
            <HeaderNavigation
                title="Empleados"
                description="Gestiona la información de tu equipo de trabajo"
                actionButton={{
                    label: "Crear Empleado",
                    icon: "UserPlus",
                    onClick: () => handleOpenModal()
                }}
                secondaryButtons={[
                    {
                        label: "Perfiles",
                        icon: "Tag",
                        onClick: navigateToPerfiles,
                        variant: "outline",
                        className: "border-purple-600 text-purple-300 hover:bg-purple-800"
                    }
                ]}
            />


            {/* Lista de empleados */}
            <PersonalListSimple
                personal={empleados.map(convertPersonalFromAPI)}
                onEdit={(personal: Personal) => {
                    // Buscar el empleado original por ID para mantener la referencia correcta
                    const originalEmpleado = empleados.find(emp => emp.id === personal.id);
                    if (originalEmpleado) {
                        handleOpenModal(originalEmpleado);
                    }
                }}
                onDelete={handleDeleteEmpleado}
                onToggleActive={handleToggleActive}
                loading={loading}
                filterType="EMPLEADO"
            />

            {/* Modal para crear/editar empleado */}
            <PersonalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveEmpleado}
                personal={editingEmpleado ? convertPersonalFromAPI(editingEmpleado) : null}
                loading={modalLoading}
                defaultType="EMPLEADO"
                studioSlug={slug}
            />
        </div>
    );
}