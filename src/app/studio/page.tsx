'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    TrendingUp,
    Shield,
    Clock,
    Star,
    ArrowRight,
    Zap,
    Target,
    BarChart3
} from 'lucide-react';

export default function StudioLandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                        🚀 Plataforma #1 para Estudios
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Potencia tu Estudio con
                        <span className="text-blue-400 block">ProSocial Platform</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        La plataforma integral que transforma la gestión de tu estudio.
                        Automatiza procesos, gestiona clientes y aumenta tus ingresos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                            <Zap className="mr-2 h-5 w-5" />
                            Empezar Gratis
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-zinc-800 hover:text-white px-8 py-4 text-lg">
                            <Users className="mr-2 h-5 w-5" />
                            Ver Demo
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                        <div className="text-gray-300">Estudios Activos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
                        <div className="text-gray-300">Satisfacción</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">3x</div>
                        <div className="text-gray-300">Más Ingresos</div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Todo lo que necesitas para hacer crecer tu estudio
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-white">Gestión de Clientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    CRM completo con seguimiento de leads, historial de conversaciones y automatización de procesos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-white">Analytics Avanzados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Métricas en tiempo real, reportes detallados y insights para optimizar tu negocio.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-white">Seguridad Total</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Protección de datos, respaldos automáticos y cumplimiento con estándares internacionales.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-white">Automatización</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Flujos de trabajo automatizados, recordatorios inteligentes y gestión de tareas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-white">Marketing Integrado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Herramientas de marketing, seguimiento de campañas y generación de leads.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardHeader>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                                </div>
                                <CardTitle className="text-white">Escalabilidad</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300">
                                    Crece sin límites con planes flexibles que se adaptan a tu negocio.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¿Listo para transformar tu estudio?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Únete a cientos de estudios que ya están creciendo con ProSocial Platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-zinc-100 px-8 py-4 text-lg">
                            <ArrowRight className="mr-2 h-5 w-5" />
                            Comenzar Ahora
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-zinc-800 hover:text-white px-8 py-4 text-lg">
                            <Users className="mr-2 h-5 w-5" />
                            Hablar con un Experto
                        </Button>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Lo que dicen nuestros clientes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardContent className="pt-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-4">
                                    &quot;ProSocial Platform revolucionó completamente la gestión de mi estudio.
                                    Ahora puedo enfocarme en lo que realmente importa: mis clientes.&quot;
                                </p>
                                <div className="text-white font-semibold">María González</div>
                                <div className="text-gray-400 text-sm">Estudio Fotografía María</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardContent className="pt-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-4">
                                    &quot;La automatización me ahorra horas cada día.
                                    Mis ingresos han aumentado un 300% desde que uso la plataforma.&quot;
                                </p>
                                <div className="text-white font-semibold">Carlos Rodríguez</div>
                                <div className="text-gray-400 text-sm">Eventos Carlos</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-800 border-zinc-700">
                            <CardContent className="pt-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-4">
                                    &quot;El soporte es excepcional y la plataforma es súper intuitiva.
                                    Recomiendo ProSocial Platform a todos mis colegas.&quot;
                                </p>
                                <div className="text-white font-semibold">Ana Martínez</div>
                                <div className="text-gray-400 text-sm">Fotografía Ana</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Comienza tu transformación hoy
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Prueba ProSocial Platform gratis por 14 días. Sin compromisos.
                    </p>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl">
                        <Zap className="mr-2 h-6 w-6" />
                        Empezar Prueba Gratuita
                    </Button>
                </div>
            </div>
        </div>
    );
}
