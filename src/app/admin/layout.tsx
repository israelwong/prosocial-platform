import Link from 'next/link'

export default function AdminLayout({
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
                            <Link href="/admin" className="flex items-center space-x-3">
                                <div className="text-xl font-bold text-white">ProSocial Platform</div>
                            </Link>
                            <nav className="hidden md:flex items-center space-x-6">
                                <Link href="/admin/dashboard" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/admin/studios" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Estudios
                                </Link>
                                <Link href="/admin/leads" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Leads
                                </Link>
                                <Link href="/admin/revenue" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Revenue
                                </Link>
                                <Link href="/admin/analytics" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                    Analytics
                                </Link>
                            </nav>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Admin Panel
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