import { Metadata } from 'next'
import { StudioNavigation } from '@/components/studio-navigation'

export const metadata: Metadata = {
    title: 'Studio Dashboard | ProSocial Platform',
    description: 'Panel de control del estudio',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <StudioNavigation />
                    </div>
                </div>
            </header>
            <main className="container mx-auto">
                {children}
            </main>
        </div>
    )
}
