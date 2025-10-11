'use client';

import React from 'react';
import { Phone, MapPin, Calendar, MessageCircle } from 'lucide-react';

interface ContactoSectionPreviewProps {
    data?: {
        descripcion?: string;
        direccion?: string;
        google_maps_url?: string;
        telefonos?: Array<{
            numero: string;
            tipo: 'llamadas' | 'whatsapp' | 'ambos';
            etiqueta?: string;
            is_active?: boolean;
        }>;
        zonas_trabajo?: Array<{
            nombre: string;
        }>;
        horarios?: Array<{
            dia: string;
            apertura: string;
            cierre: string;
            cerrado: boolean;
        }>;
    };
}

export function ContactoSectionPreview({ data }: ContactoSectionPreviewProps) {
    const contactoData = data || {};

    // Debug: Log data to see what's being passed
    console.log('🔍 ContactoSectionPreview - Data received:', data);
    console.log('🔍 ContactoSectionPreview - Horarios:', contactoData.horarios);
    console.log('🔍 ContactoSectionPreview - Full contactoData:', contactoData);

    // Helper function to safely get string values
    const getStringValue = (value: unknown, defaultValue: string): string => {
        return typeof value === 'string' ? value : defaultValue;
    };

    // Helper function to safely get array values
    const getArrayValue = <T,>(value: unknown, defaultValue: T[]): T[] => {
        return Array.isArray(value) ? value as T[] : defaultValue;
    };

    const telefonos = getArrayValue(contactoData.telefonos, []);
    const zonasTrabajo = getArrayValue(contactoData.zonas_trabajo, []);
    const horarios = getArrayValue(contactoData.horarios, []);

    console.log('🔍 ContactoSectionPreview - Processed horarios:', horarios);

    // Función para agrupar horarios similares
    const agruparHorarios = () => {
        const diasSemana = [
            { key: 'monday', label: 'Lunes' },
            { key: 'tuesday', label: 'Martes' },
            { key: 'wednesday', label: 'Miércoles' },
            { key: 'thursday', label: 'Jueves' },
            { key: 'friday', label: 'Viernes' },
            { key: 'saturday', label: 'Sábado' },
            { key: 'sunday', label: 'Domingo' }
        ];

        // Filtrar solo horarios activos (no cerrados)
        const horariosActivos = horarios.filter(horario => !horario.cerrado);

        // Si no hay horarios activos, mostrar como cerrado
        if (horariosActivos.length === 0) {
            return [{
                dias: ['Estudio'],
                horario: 'Cerrado',
                cerrado: true
            }];
        }

        // Agrupar por horario y estado
        const horariosPorGrupo = new Map<string, {
            dias: string[];
            horario: string;
            cerrado: boolean;
        }>();

        horariosActivos.forEach(horario => {
            const key = `${horario.apertura}-${horario.cierre}`;

            if (!horariosPorGrupo.has(key)) {
                horariosPorGrupo.set(key, {
                    dias: [],
                    horario: `${horario.apertura} - ${horario.cierre}`,
                    cerrado: false
                });
            }

            const grupo = horariosPorGrupo.get(key)!;
            // Manejar tanto formato inglés como español
            const diaLabel = diasSemana.find(d => d.key === horario.dia)?.label ||
                diasSemana.find(d => d.label === horario.dia)?.label ||
                horario.dia;
            grupo.dias.push(diaLabel);
        });

        // Convertir a array y ordenar
        return Array.from(horariosPorGrupo.values()).sort((a, b) => {
            const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            const aIndex = ordenDias.indexOf(a.dias[0]);
            const bIndex = ordenDias.indexOf(b.dias[0]);
            return aIndex - bIndex;
        });
    };

    const gruposHorarios = agruparHorarios();

    return (
        <div className="space-y-6 p-4">
            {/* Botones de acción principales */}
            <div className="space-y-3">
                {/* Botón Llamar */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                    <Phone className="h-5 w-5" />
                    Llamar ahora
                </button>

                {/* Botón WhatsApp */}
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    Enviar mensaje
                </button>

                {/* Botón Agendar */}
                <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                    <Calendar className="h-5 w-5" />
                    Agendar cita
                </button>
            </div>

            {/* Descripción del negocio */}
            {contactoData.descripcion && (
                <div className="space-y-2">
                    <h3 className="text-zinc-400 text-sm font-medium">Descripción del negocio</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                        {contactoData.descripcion}
                    </p>
                </div>
            )}

            {/* Ubicación */}
            {contactoData.direccion && (
                <div className="space-y-2">
                    <h3 className="text-zinc-400 text-sm font-medium">Ubicación</h3>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300 text-sm">{contactoData.direccion}</span>
                    </div>
                    {contactoData.google_maps_url && (
                        <a
                            href={contactoData.google_maps_url}
                            className="text-blue-400 text-sm underline hover:text-blue-300"
                        >
                            Ver en maps
                        </a>
                    )}
                </div>
            )}

            {/* Zona de operación */}
            {zonasTrabajo.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-zinc-400 text-sm font-medium">Zona de operación</h3>
                    <div className="flex flex-wrap gap-2">
                        {zonasTrabajo.slice(0, 4).map((zona, index) => (
                            <span
                                key={index}
                                className="text-xs bg-zinc-700 text-zinc-300 px-3 py-1 rounded-full"
                            >
                                {zona.nombre}
                            </span>
                        ))}
                        {zonasTrabajo.length > 4 && (
                            <span className="text-xs bg-zinc-700 text-zinc-500 px-3 py-1 rounded-full">
                                +{zonasTrabajo.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Horarios de atención */}
            {gruposHorarios.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-zinc-400 text-sm font-medium">Horarios de atención</h3>
                    <div className="space-y-2">
                        {gruposHorarios.map((grupo, index) => (
                            <div key={index} className="bg-zinc-800/50 rounded-lg p-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {grupo.dias.map((dia, diaIndex) => (
                                            <span key={diaIndex} className="text-zinc-300 font-medium text-sm">
                                                {dia}
                                                {diaIndex < grupo.dias.length - 1 && <span className="text-zinc-500 mx-1">•</span>}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${grupo.cerrado ? 'text-red-400' : 'text-green-400'}`}>
                                            {grupo.horario}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${grupo.cerrado ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                                            {grupo.cerrado ? 'Cerrado' : 'Abierto'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
