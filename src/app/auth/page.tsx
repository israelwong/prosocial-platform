'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirigir automáticamente a /auth/login
        router.replace('/auth/login')
    }, [router])

    // Mostrar un loading mientras redirige
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Redirigiendo al login...</p>
            </div>
        </div>
    )
}
