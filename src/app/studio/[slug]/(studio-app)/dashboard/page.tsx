import React from 'react';

export default function DashboardPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="mt-2 text-zinc-400">
                Bienvenido a tu dashboard. Aquí podrás ver un resumen de tu estudio.
            </p>
            {/* Aquí irá el contenido del dashboard */}
        </div>
    );
}
