import { redirect } from "next/navigation";

interface StudioPageProps {
    params: Promise<{
        studioSlug: string;
    }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
    const { studioSlug } = await params;

    // Por ahora, simplemente mostrar información básica
    // Más adelante implementaremos la lógica completa de validación de studio

    if (studioSlug !== "prosocial-events") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Bienvenido a {studioSlug}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Dashboard de ProSocial Events - Tu plataforma está lista
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                Proyectos Activos
                            </h3>
                            <p className="text-3xl font-bold text-blue-600">3</p>
                            <p className="text-sm text-blue-700">de 15 permitidos</p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                Revenue Total
                            </h3>
                            <p className="text-3xl font-bold text-green-600">$53,000</p>
                            <p className="text-sm text-green-700">MXN este mes</p>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-purple-900 mb-2">
                                Plan Actual
                            </h3>
                            <p className="text-3xl font-bold text-purple-600">Pro</p>
                            <p className="text-sm text-purple-700">$79/mes</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Estado de Implementación
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="text-green-500 mr-3">✅</span>
                                <span>Proyecto Next.js 15 configurado</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-3">✅</span>
                                <span>Schema de base de datos creado</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-3">✅</span>
                                <span>Componentes UI instalados (Shadcn)</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-3">✅</span>
                                <span>Middleware multi-tenant funcionando</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-500 mr-3">✅</span>
                                <span>Landing page configurada</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-yellow-500 mr-3">⏳</span>
                                <span>Conexión a Supabase (pendiente credenciales)</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-yellow-500 mr-3">⏳</span>
                                <span>Autenticación (siguiente paso)</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-yellow-500 mr-3">⏳</span>
                                <span>Dashboard completo (siguiente paso)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
