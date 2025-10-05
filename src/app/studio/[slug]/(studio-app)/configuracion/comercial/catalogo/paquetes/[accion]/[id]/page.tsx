import React from 'react';
import { obtenerCatalogo } from '@/lib/actions/studio/config/catalogo.actions';
import { obtenerPaquete } from '@/lib/actions/studio/negocio/paquetes.actions';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import { CotizacionFormularioClient } from '../../components/PaqueteFormulario';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface PaqueteFormPageProps {
    params: Promise<{
        slug: string;
        accion: 'crear' | 'editar';
        id: string;
    }>;
}

export default async function PaqueteFormPage({ params }: PaqueteFormPageProps) {
    const { slug, accion, id } = await params;

    // Validar acción
    if (accion !== 'crear' && accion !== 'editar') {
        redirect(`/${slug}/configuracion/modules/manager/catalogo-servicios/paquetes`);
    }

    // Obtener studio por slug para obtener el ID real
    const studio = await prisma.studios.findUnique({
        where: { slug: slug }
    });

    if (!studio) {
        redirect(`/studio/${slug}/configuracion/modules/manager/catalogo-servicios/paquetes`);
    }

    // Lógica diferente para crear vs editar
    let eventoTipoId: string;

    if (accion === 'crear') {
        // En crear, el id es el eventoTipoId
        const eventoTipo = await prisma.studio_evento_tipos.findUnique({
            where: { id: id }
        });

        if (!eventoTipo) {
            redirect(`/studio/${slug}/configuracion/modules/manager/catalogo-servicios/paquetes`);
        }

        eventoTipoId = id;
    } else {
        // En editar, el id es el paqueteId, necesitamos obtener el eventoTipoId del paquete
        const paquete = await prisma.studio_paquetes.findUnique({
            where: { id: id },
            select: { eventoTipoId: true }
        });

        if (!paquete) {
            redirect(`/studio/${slug}/configuracion/modules/manager/catalogo-servicios/paquetes`);
        }

        eventoTipoId = paquete.eventoTipoId;
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

    if (accion === 'editar') {
        const paqueteResult = await obtenerPaquete(id);
        if (!paqueteResult.success || !paqueteResult.data) {
            redirect(`/studio/${slug}/configuracion/modules/manager/catalogo-servicios/paquetes`);
        }
        paquete = paqueteResult.data;
    }

    return (
        <div className="px-6">
            <CotizacionFormularioClient
                catalogo={catalogo}
                eventoId={eventoTipoId}
                cotizacion={paquete}
                studioConfig={studioConfig}
                studioId={studio.id}
                studioSlug={slug}
            />
        </div>
    );
}

