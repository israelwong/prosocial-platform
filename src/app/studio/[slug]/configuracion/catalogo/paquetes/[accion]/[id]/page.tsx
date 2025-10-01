import React from 'react';
import { obtenerCatalogo } from '@/lib/actions/studio/config/catalogo.actions';
import { obtenerPaquete } from '@/lib/actions/studio/negocio/paquetes.actions';
import { obtenerTipoEventoPorId } from '@/lib/actions/studio/negocio/tipos-evento.actions';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import { PaqueteFormulario } from '../../components/PaqueteFormulario';
import { redirect } from 'next/navigation';

interface PaqueteFormPageProps {
    params: Promise<{
        slug: string;
        accion: 'nuevo' | 'editar';
        id: string;
    }>;
}

export default async function PaqueteFormPage({ params }: PaqueteFormPageProps) {
    const { slug, accion, id } = await params;

    // Validar acción
    if (accion !== 'nuevo' && accion !== 'editar') {
        redirect(`/${slug}/configuracion/catalogo/paquetes`);
    }

    // Obtener catálogo y configuración
    const [catalogoResult, configuracionResult] = await Promise.all([
        obtenerCatalogo(slug),
        obtenerConfiguracionPrecios(slug)
    ]);

    if (!catalogoResult.success || !catalogoResult.data) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">
                    Error al cargar los servicios disponibles
                </p>
            </div>
        );
    }

    if (!configuracionResult) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">
                    Error al cargar la configuración de precios
                </p>
            </div>
        );
    }

    const catalogo = catalogoResult.data;
    const studioConfig = {
        utilidad_servicio: parseFloat(configuracionResult.utilidad_servicio),
        utilidad_producto: parseFloat(configuracionResult.utilidad_producto),
        sobreprecio: parseFloat(configuracionResult.sobreprecio),
        comision_venta: parseFloat(configuracionResult.comision_venta)
    };

    // Modo edición: obtener paquete existente
    let paquete = null;
    let tipoEvento = null;

    if (accion === 'editar') {
        const paqueteResult = await obtenerPaquete(id);
        if (!paqueteResult.success || !paqueteResult.data) {
            redirect(`/${slug}/configuracion/catalogo/paquetes`);
        }
        paquete = paqueteResult.data;

        // Obtener información del tipo de evento
        const tipoEventoResult = await obtenerTipoEventoPorId(paquete.eventoTipoId);
        if (tipoEventoResult.success && tipoEventoResult.data) {
            tipoEvento = tipoEventoResult.data;
        }
    } else {
        // Modo nuevo: id es el eventoTipoId
        const tipoEventoResult = await obtenerTipoEventoPorId(id);
        if (!tipoEventoResult.success || !tipoEventoResult.data) {
            redirect(`/${slug}/configuracion/catalogo/paquetes`);
        }
        tipoEvento = tipoEventoResult.data;
    }

    return (
        <div className="px-6">
            <PaqueteFormulario
                catalogo={catalogo}
                paquete={paquete}
                tipoEvento={tipoEvento}
                studioSlug={slug}
                modo={accion}
                studioConfig={studioConfig}
            />
        </div>
    );
}

