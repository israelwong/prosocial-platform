export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400">
                Esta página tiene sidebar (está en el grupo (main))
            </p>
            <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-2">Estado del Layout</h2>
                <p className="text-zinc-300">
                    ✅ Layout raíz: Navbar visible<br />
                    ✅ Layout (main): Sidebar + contenido<br />
                    ✅ Navegación: Enlaces funcionando
                </p>
            </div>
        </div>
    );
}
