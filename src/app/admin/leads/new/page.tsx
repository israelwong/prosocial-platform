'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewLeadRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirigir a la ruta unificada con 'new' como ID
        router.replace('/admin/leads/new');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">Redirigiendo al formulario de nuevo lead...</p>
            </div>
        </div>
    );
}
