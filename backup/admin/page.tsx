'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirigir al dashboard de administración
        router.push('/admin/dashboard')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Redirigiendo...</h1>
                <p className="text-muted-foreground">Cargando el dashboard de administración</p>
            </div>
        </div>
    )
}