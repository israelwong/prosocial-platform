import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    DollarSign,
    Package,
    Users,
    User,
    Settings,
    ArrowRight,
    CheckCircle,
    Clock,
    Shield
} from 'lucide-react';
import Link from 'next/link';

interface ConfiguracionPageProps {
    params: {
        slug: string;
    };
}

export default async function ConfiguracionPage({ params }: ConfiguracionPageProps) {
    const { slug } = await params;

    const configuracionSections = [
        {
            id: 'estudio',
            title: 'Configuración del Estudio',
            description: 'Todo sobre la identidad y presentación de tu marca.',
            icon: Building2,
            color: 'blue',
            items: [
                {
                    title: 'Identidad de Marca',
                    description: 'Nombre del negocio, logo, colores principales',
                    href: `/studio/${slug}/configuracion/estudio/identidad`,
                    status: 'completed'
                },
                {
                    title: 'Información de Contacto',
                    description: 'Correo público, teléfono, dirección del estudio',
                    href: `/studio/${slug}/configuracion/estudio/contacto`,
                    status: 'completed'
                },
                {
                    title: 'Redes Sociales',
                    description: 'Configura tus redes sociales',
                    href: `/studio/${slug}/configuracion/estudio/redes-sociales`,
                    status: 'completed'
                },
                {
                    title: 'Horarios de Atención',
                    description: 'Días y horas en que atiendes a clientes',
                    href: `/studio/${slug}/configuracion/estudio/horarios`,
                    status: 'completed'
                }
            ]
        },
        {
            id: 'negocio',
            title: 'Reglas de Negocio y Finanzas',
            description: 'Cómo ganas dinero y gestionas los pagos.',
            icon: DollarSign,
            color: 'green',
            items: [
                {
                    title: 'Precios y Utilidad',
                    description: 'Define tus reglas maestras de precios',
                    href: `/studio/${slug}/configuracion/negocio/precios-y-utilidad`,
                    status: 'completed'
                },
                {
                    title: 'Condiciones Comerciales',
                    description: 'Crea tus planes de pago',
                    href: `/studio/${slug}/configuracion/negocio/condiciones-comerciales`,
                    status: 'completed'
                },
                {
                    title: 'Métodos de Pago',
                    description: 'Configura las formas de pago',
                    href: `/studio/${slug}/configuracion/negocio/metodos-de-pago`,
                    status: 'completed'
                },
                {
                    title: 'Cuentas Bancarias',
                    description: 'Registra la cuenta donde recibirás pagos',
                    href: `/studio/${slug}/configuracion/negocio/cuentas-bancarias`,
                    status: 'completed'
                }
            ]
        },
        {
            id: 'catalogo',
            title: 'Catálogo y Paquetes',
            description: 'Lo que vendes.',
            icon: Package,
            color: 'purple',
            items: [
                {
                    title: 'Servicios',
                    description: 'Lista detallada de todos tus servicios',
                    href: `/studio/${slug}/configuracion/catalogo/servicios`,
                    status: 'completed'
                },
                {
                    title: 'Paquetes',
                    description: 'Crea y combina servicios para ofrecer paquetes',
                    href: `/studio/${slug}/configuracion/catalogo/paquetes`,
                    status: 'completed'
                },
                {
                    title: 'Especialidades',
                    description: 'Organiza por tipo de evento',
                    href: `/studio/${slug}/configuracion/catalogo/especialidades`,
                    status: 'completed'
                }
            ]
        },
        {
            id: 'equipo',
            title: 'Gestión de Equipo',
            description: 'Las personas que trabajan contigo.',
            icon: Users,
            color: 'orange',
            items: [
                {
                    title: 'Miembros del Equipo',
                    description: 'Gestiona empleados y proveedores',
                    href: `/studio/${slug}/configuracion/equipo/empleados`,
                    status: 'completed'
                },
                {
                    title: 'Perfiles Profesionales',
                    description: 'Define roles y permisos',
                    href: `/studio/${slug}/configuracion/equipo/perfiles`,
                    status: 'completed'
                }
            ]
        },
        {
            id: 'cuenta',
            title: 'Cuenta y Suscripción',
            description: 'Todo sobre tu cuenta personal en ZENPro.',
            icon: User,
            color: 'indigo',
            items: [
                {
                    title: 'Perfil',
                    description: 'Tu nombre, correo, contraseña',
                    href: `/studio/${slug}/configuracion/cuenta/perfil`,
                    status: 'completed'
                },
                {
                    title: 'Suscripción',
                    description: 'Gestiona tu plan y pagos',
                    href: `/studio/${slug}/configuracion/cuenta/suscripcion`,
                    status: 'completed'
                },
                {
                    title: 'Notificaciones',
                    description: 'Configura cómo recibir notificaciones',
                    href: `/studio/${slug}/configuracion/cuenta/notificaciones`,
                    status: 'completed'
                },
                {
                    title: 'Seguridad',
                    description: 'Autenticación de dos factores',
                    href: `/studio/${slug}/configuracion/cuenta/seguridad`,
                    status: 'completed'
                }
            ]
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-400" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-400" />;
            case 'error':
                return <Shield className="h-4 w-4 text-red-400" />;
            default:
                return <Clock className="h-4 w-4 text-zinc-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="secondary" className="bg-green-600 text-white">Completado</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-600 text-white">Pendiente</Badge>;
            case 'error':
                return <Badge variant="secondary" className="bg-red-600 text-white">Error</Badge>;
            default:
                return <Badge variant="outline" className="border-zinc-600 text-zinc-400">Sin configurar</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Configuración</h1>
                <p className="text-zinc-400">
                    Gestiona todos los aspectos de tu estudio fotográfico desde un solo lugar
                </p>
            </div>

            {/* Secciones de Configuración */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {configuracionSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                        <Card key={section.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${section.color}-600/20`}>
                                        <IconComponent className={`h-6 w-6 text-${section.color}-400`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">{section.title}</CardTitle>
                                        <CardDescription className="text-zinc-400">
                                            {section.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {section.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getStatusIcon(item.status)}
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium">{item.title}</h4>
                                                <p className="text-sm text-zinc-400">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(item.status)}
                                            <Link href={item.href}>
                                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Información adicional */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configuración Avanzada
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Herramientas adicionales para usuarios avanzados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={`/studio/${slug}/configuracion/avanzado`}>
                            <Button variant="outline" className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                                <Settings className="h-4 w-4 mr-2" />
                                Configuración Avanzada
                            </Button>
                        </Link>
                        <Link href={`/studio/${slug}/configuracion/integraciones`}>
                            <Button variant="outline" className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                                <Shield className="h-4 w-4 mr-2" />
                                Integraciones
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
