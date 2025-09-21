'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ContactoStats } from './components/ContactoStats';
import { ContactoList } from './components/ContactoList';
import { ContactoModal } from './components/ContactoModal';
import { Telefono, TelefonoCreate, ContactoData } from './types';

export default function ContactoPage() {
    const [telefonos, setTelefonos] = useState<Telefono[]>([]);
    const [contactoData, setContactoData] = useState<ContactoData>({
        direccion: '',
        website: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTelefono, setEditingTelefono] = useState<Telefono | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Datos iniciales de ejemplo
    const initialTelefonos: Telefono[] = [
        {
            id: '1',
            numero: '+52 55 1234 5678',
            tipo: 'principal',
            activo: true
        },
        {
            id: '2',
            numero: '+52 55 9876 5432',
            tipo: 'whatsapp',
            activo: true
        }
    ];

    const initialContactoData: ContactoData = {
        direccion: 'Av. Principal 123, Col. Centro, Ciudad, CP 12345',
        website: 'https://www.studiodemo.com'
    };

    useEffect(() => {
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async (isRetry = false) => {
        if (!isRetry) {
            setLoading(true);
        }
        setError(null);

        try {
            // Simular carga de datos (en producción sería una API call)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setTelefonos(initialTelefonos);
            setContactoData(initialContactoData);
        } catch (err) {
            console.error('Error loading contacto data:', err);
            setError('Error al cargar información de contacto');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (telefono?: Telefono) => {
        setEditingTelefono(telefono || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTelefono(null);
    };

    const handleSaveTelefono = async (data: TelefonoCreate) => {
        setModalLoading(true);

        try {
            if (editingTelefono) {
                // Actualizar teléfono existente
                const telefonoActualizado: Telefono = {
                    ...editingTelefono,
                    ...data
                };
                
                setTelefonos(prev => prev.map(t => 
                    t.id === editingTelefono.id ? telefonoActualizado : t
                ));
                
                toast.success('Teléfono actualizado exitosamente');
            } else {
                // Crear nuevo teléfono
                const nuevoTelefono: Telefono = {
                    id: Date.now().toString(),
                    ...data
                };
                
                setTelefonos(prev => [...prev, nuevoTelefono]);
                toast.success('Teléfono agregado exitosamente');
            }
            
            handleCloseModal();
        } catch (err) {
            console.error('Error saving telefono:', err);
            toast.error('Error al guardar teléfono');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTelefono = async (id: string) => {
        try {
            setTelefonos(prev => prev.filter(t => t.id !== id));
            toast.success('Teléfono eliminado exitosamente');
        } catch (err) {
            console.error('Error deleting telefono:', err);
            toast.error('Error al eliminar teléfono');
        }
    };

    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            setTelefonos(prev => prev.map(t =>
                t.id === id ? { ...t, activo } : t
            ));
        } catch (err) {
            console.error('Error toggling telefono:', err);
            toast.error('Error al cambiar estado del teléfono');
        }
    };

    const handleUpdateContactoData = async (field: keyof ContactoData, value: string) => {
        try {
            setContactoData(prev => ({ ...prev, [field]: value }));
        } catch (err) {
            console.error('Error updating contacto data:', err);
            toast.error('Error al actualizar información');
        }
    };

    if (error && !loading) {
        return (
            <div className="p-6">
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={() => loadData(false)} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Estadísticas */}
            <ContactoStats 
                telefonos={telefonos} 
                contactoData={contactoData} 
                loading={loading} 
            />

            {/* Lista de contacto */}
            <ContactoList
                telefonos={telefonos}
                contactoData={contactoData}
                onAddTelefono={() => handleOpenModal()}
                onEditTelefono={handleOpenModal}
                onDeleteTelefono={handleDeleteTelefono}
                onToggleActive={handleToggleActive}
                onUpdateContactoData={handleUpdateContactoData}
                loading={loading}
            />

            {/* Modal para crear/editar teléfonos */}
            <ContactoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTelefono}
                editingTelefono={editingTelefono}
                loading={modalLoading}
            />

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usa esta información?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Footer con información de contacto</li>
                                <li>• Formularios de contacto</li>
                                <li>• Botones de WhatsApp</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Cotizaciones y propuestas</li>
                                <li>• Emails y notificaciones</li>
                                <li>• Documentos oficiales</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
