import React from 'react';
import { redirect } from 'next/navigation';

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Redirigir al dashboard cuando el suscriptor ingrese a su estudio
    redirect(`/${slug}/studio/dashboard`);
}
