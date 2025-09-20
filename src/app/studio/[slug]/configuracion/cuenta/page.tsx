'use client';

import React from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    Phone,
    Clock,
    Share2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const navigationItems = [
    {
        name: 'Identidad',
        href: '/studio/demo-studio/configuracion/cuenta/identidad',
        icon: User,
        description: 'Información general del negocio, logos y branding'
    },
    {
        name: 'Contacto',
        href: '/studio/demo-studio/configuracion/cuenta/contacto',
        icon: Phone,
        description: 'Teléfonos, dirección y página web'
    },
    {
        name: 'Horarios',
        href: '/studio/demo-studio/configuracion/cuenta/horarios',
        icon: Clock,
        description: 'Horarios de atención al cliente'
    },
    {
        name: 'Redes Sociales',
        href: '/studio/demo-studio/configuracion/cuenta/redes-sociales',
        icon: Share2,
        description: 'Enlaces a tus redes sociales'
    }
];

export default function CuentaPage() {
    return (
        <SectionLayout
            title="Cuenta"
            description="Configuración de identidad y contacto del estudio"
            navigationItems={navigationItems}
        >
            <div className="space-y-6">
                {/* Resumen de configuración */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {navigationItems.map((item) => (
                        <Card key={item.name} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <item.icon className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <CardDescription className="text-zinc-400 mb-4">
                                    {item.description}
                                </CardDescription>
                                <Link href={item.href}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Configurar
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Información adicional */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Información Importante</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Esta información se utilizará en tu landing page, portales de cotización y comunicación con clientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-zinc-300">
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>La información de <strong>Identidad</strong> aparecerá en el header y footer de tu landing page</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Los <strong>Contactos</strong> estarán disponibles en formularios y portales de cliente</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Los <strong>Horarios</strong> se mostrarán en tu calendario público y landing page</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Las <strong>Redes Sociales</strong> aparecerán como enlaces en tu landing page</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SectionLayout>
    );
}
