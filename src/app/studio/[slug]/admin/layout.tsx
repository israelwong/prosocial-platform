import Link from 'next/link'

export default function StudioAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-900">
            <header className="border-b border-zinc-700 bg-zinc-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/studio/[slug]" className="flex items-center space-x-3">
                                <div className="text-xl font-bold text-white">Mi Estudio</div>
                            </Link>
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href="/studio/[slug]/admin" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/studio/[slug]/admin/projects" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Proyectos
                                </Link>
                                <Link href="/studio/[slug]/admin/clients" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Clientes
                                </Link>
                                <Link href="/studio/[slug]/admin/calendar" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Calendario
                                </Link>
                                <Link href="/studio/[slug]/admin/settings" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Configuración
                                </Link>
                            </nav>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Panel de Administración
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
}
