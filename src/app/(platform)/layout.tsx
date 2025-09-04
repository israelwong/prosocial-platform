import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Administrador | ProSocial Platform',
    description: 'Panel de administración de la plataforma ProSocial',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">ProSocial Admin</h1>
                        </div>
                        <nav className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                                Administrador de Plataforma
                            </span>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="container mx-auto">
                {children}
            </main>
        </div>
    )
}
