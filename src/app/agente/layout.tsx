import Link from 'next/link'

export default function AgenteLayout({
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
                            <Link href="/agente" className="flex items-center space-x-3">
                                <div className="text-xl font-bold text-white">ProSocial Platform</div>
                            </Link>
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href="/agente" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/agente/leads" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Mis Leads
                                </Link>
                                <Link href="/agente/actividades" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Actividades
                                </Link>
                                <Link href="/agente/reportes" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Reportes
                                </Link>
                            </nav>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Panel Agente
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
