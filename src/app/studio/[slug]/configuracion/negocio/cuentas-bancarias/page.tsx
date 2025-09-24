'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Shield, CreditCard } from 'lucide-react';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CuentaBancariaStats } from './components/CuentaBancariaStats';
import { CuentaBancariaList } from './components/CuentaBancariaList';
import { CuentaBancariaModal } from './components/CuentaBancariaModal';
import { CuentaBancaria } from './types';

interface CuentaBancariaFormData {
  banco: string;
  numeroCuenta: string;
  titular: string;
  activo: boolean;
}
import {
  obtenerCuentasBancariasStudio,
  obtenerEstadisticasCuentasBancarias,
  crearCuentaBancaria,
  actualizarCuentaBancaria,
  eliminarCuentaBancaria,
  toggleCuentaBancariaEstado
} from '@/lib/actions/studio/config/cuentas-bancarias.actions';

export default function CuentasBancariasPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    activas: 0,
    inactivas: 0,
    principales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<CuentaBancaria | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
        setRetryCount(0);
      }

      // Cargar cuentas bancarias y estadísticas en paralelo usando Server Actions
      const [cuentasData, statsData] = await Promise.all([
        obtenerCuentasBancariasStudio(slug),
        obtenerEstadisticasCuentasBancarias(slug)
      ]);

      setCuentas(cuentasData);
      setStats(statsData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos';

      // Si es un error de conexión y no hemos reintentado mucho, intentar de nuevo
      if (retryCount < 3 && (errorMessage.includes('conexión') || errorMessage.includes('database') || errorMessage.includes('server'))) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          loadData(true);
        }, 2000 * retryCount); // Reintento con delay incremental
        return;
      }

      setError(errorMessage);
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  // Funciones del modal
  const handleOpenModal = (cuenta?: CuentaBancaria) => {
    setEditingCuenta(cuenta || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCuenta(null);
  };

  const handleSaveCuenta = async (data: CuentaBancariaFormData) => {
    setModalLoading(true);

    try {
      if (editingCuenta) {
        // Actualizar cuenta bancaria existente usando Server Action
        const cuentaActualizada = await actualizarCuentaBancaria(editingCuenta.id, {
          id: editingCuenta.id,
          banco: data.banco,
          numeroCuenta: data.numeroCuenta,
          titular: data.titular,
          activo: data.activo,
        });

        setCuentas(prev => prev.map(c => c.id === editingCuenta.id ? cuentaActualizada : c));
        toast.success('Cuenta bancaria actualizada exitosamente');
      } else {
        // Lógica automática de cuenta principal:
        // - Si no hay cuentas, la primera es principal
        // - Si hay cuentas, la nueva NO es principal
        const esPrincipal = cuentas.length === 0;

        // Crear nueva cuenta bancaria usando Server Action
        const nuevaCuenta = await crearCuentaBancaria(slug, {
          banco: data.banco,
          numeroCuenta: data.numeroCuenta,
          tipoCuenta: 'corriente', // Valor por defecto para CLABE
          titular: data.titular,
          activo: data.activo,
          esPrincipal: esPrincipal,
        });

        setCuentas(prev => [...prev, nuevaCuenta]);
        toast.success('Cuenta bancaria agregada exitosamente');
      }

      // Recargar estadísticas
      const statsData = await obtenerEstadisticasCuentasBancarias(slug);
      setStats(statsData);
    } catch (err) {
      console.error('Error saving cuenta bancaria:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
      throw err; // Re-throw para que el modal maneje el error
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCuenta = async (id: string) => {
    try {
      // Eliminar cuenta bancaria usando Server Action
      await eliminarCuentaBancaria(id);

      setCuentas(prev => prev.filter(c => c.id !== id));
      toast.success('Cuenta bancaria eliminada exitosamente');

      // Recargar estadísticas
      const statsData = await obtenerEstadisticasCuentasBancarias(slug);
      setStats(statsData);
    } catch (err) {
      console.error('Error al eliminar cuenta bancaria:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la cuenta bancaria';
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (id: string, activo: boolean) => {
    try {
      // Toggle estado usando Server Action
      const cuentaActualizada = await toggleCuentaBancariaEstado(id, {
        id,
        activo,
      });

      setCuentas(prev => prev.map(c => c.id === id ? cuentaActualizada : c));
      toast.success(`Cuenta bancaria ${activo ? 'activada' : 'desactivada'} exitosamente`);

      // Recargar estadísticas
      const statsData = await obtenerEstadisticasCuentasBancarias(slug);
      setStats(statsData);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado de la cuenta bancaria';
      toast.error(errorMessage);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-zinc-400">Cargando cuentas bancarias...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          {retryCount > 0 && (
            <p className="text-zinc-500 text-sm mb-4">
              Reintentos: {retryCount}/3
            </p>
          )}
          <button
            onClick={() => loadData(false)}
            className="text-blue-400 hover:text-blue-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">
      {/* Header */}
      <HeaderNavigation
        title="Cuentas Bancarias"
        description="Registra las cuentas CLABE donde recibirás los pagos de tus clientes"
      />

      {/* Estadísticas */}
      <CuentaBancariaStats stats={stats} loading={loading} />

      {/* Lista de cuentas bancarias */}
      <CuentaBancariaList
        cuentas={cuentas}
        onEdit={handleOpenModal}
        onDelete={handleDeleteCuenta}
        onToggleActive={handleToggleActive}
        onAdd={() => handleOpenModal()}
        loading={loading}
      />

      {/* Información de seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Información encriptada</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">
                {cuentas.length > 0 ? `${cuentas.length} cuenta(s) configurada(s)` : 'Sin cuentas configuradas'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <CuentaBancariaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCuenta}
        editingCuenta={editingCuenta}
        loading={modalLoading}
      />
    </div>
  );
}