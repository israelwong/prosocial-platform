export default function PromocionesColumn() {
    return (
        <div className="sticky top-6">
            <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔥 Promociones</h3>
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
                        <h4 className="text-white font-medium">Descuento 20%</h4>
                        <p className="text-white/80 text-sm">En sesiones de estudio</p>
                        <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                            Aplicar
                        </button>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4">
                        <h4 className="text-white font-medium">Paquete Familiar</h4>
                        <p className="text-white/80 text-sm">3 sesiones por $299</p>
                        <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                            Reservar
                        </button>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4">
                        <h4 className="text-white font-medium">Nuevo Cliente</h4>
                        <p className="text-white/80 text-sm">Primera sesión gratis</p>
                        <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                            Aprovechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
