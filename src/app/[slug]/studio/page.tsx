import React from 'react';
import { redirect } from 'next/navigation';

export default function StudioPage() {
    // Redirigir al dashboard cuando el suscriptor ingrese a su estudio
    redirect('/studio/dashboard');
}
