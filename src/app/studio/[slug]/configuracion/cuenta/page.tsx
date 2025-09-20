'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CuentaPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    useEffect(() => {
        // Redirigir automáticamente a la sección de identidad
        router.replace(`/studio/${slug}/configuracion/cuenta/identidad`);
    }, [router, slug]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-zinc-400">Redirigiendo a configuración de identidad...</p>
            </div>
        </div>
    );
}
