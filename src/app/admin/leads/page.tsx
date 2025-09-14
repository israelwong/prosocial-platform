'use client';

import React, { useState } from 'react';
import LeadsStats from './components/LeadsStats';
import LeadsFilters from './components/LeadsFilters';
import LeadsList from './components/LeadsList';

interface Lead {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    estado: string;
    fechaCreacion: string;
    agente: string | null;
}

export default function LeadsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data para desarrollo
    const leads = [
        {
            id: '1',
            nombre: 'María González',
            email: 'maria@email.com',
            telefono: '+52 55 1234 5678',
            estado: 'nuevo',
            fechaCreacion: '2024-01-15',
            agente: null
        },
        {
            id: '2',
            nombre: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            telefono: '+52 55 9876 5432',
            estado: 'contactado',
            fechaCreacion: '2024-01-14',
            agente: 'Ana Martínez'
        },
        {
            id: '3',
            nombre: 'Laura Sánchez',
            email: 'laura@email.com',
            telefono: '+52 55 5555 1234',
            estado: 'calificado',
            fechaCreacion: '2024-01-13',
            agente: 'Carlos Rodríguez'
        }
    ];

    // Filtrar leads basado en el término de búsqueda
    const filteredLeads = leads.filter(lead =>
        lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefono.includes(searchTerm)
    );

    // Calcular estadísticas
    const totalLeads = leads.length;
    const nuevosLeads = leads.filter(l => l.estado === 'nuevo').length;
    const contactadosLeads = leads.filter(l => l.estado === 'contactado').length;
    const calificadosLeads = leads.filter(l => l.estado === 'calificado').length;

    const handleViewDetails = (lead: Lead) => {
        // Navegar a la página de detalles del lead
        window.location.href = `/admin/leads/${lead.id}`;
    };

    const handleFilterClick = () => {
        // TODO: Implementar modal de filtros avanzados
        console.log('Abrir filtros avanzados');
    };

    const handleNewLeadsClick = () => {
        // TODO: Implementar filtro por leads nuevos
        console.log('Filtrar leads nuevos');
    };

    const handleUnassignedClick = () => {
        // TODO: Implementar filtro por leads sin asignar
        console.log('Filtrar leads sin asignar');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-800 pb-6">
                <h1 className="text-3xl font-bold text-white">Gestión de Leads</h1>
                <p className="text-zinc-400 mt-2">
                    Administra y sigue el progreso de todos los leads
                </p>
            </div>

            {/* Stats Cards */}
            <LeadsStats
                totalLeads={totalLeads}
                nuevosLeads={nuevosLeads}
                contactadosLeads={contactadosLeads}
                calificadosLeads={calificadosLeads}
            />

            {/* Filters and Search */}
            <LeadsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFilterClick={handleFilterClick}
                onNewLeadsClick={handleNewLeadsClick}
                onUnassignedClick={handleUnassignedClick}
            />

            {/* Leads List */}
            <LeadsList
                leads={filteredLeads}
                onViewDetails={handleViewDetails}
            />
        </div>
    );
}