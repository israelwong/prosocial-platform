export default function ZenMagicColumn() {
    return (
        <div className="sticky top-6">
            <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">✨ ZEN Magic</h3>
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4">
                        <h4 className="text-white font-medium">Asistente IA</h4>
                        <p className="text-white/80 text-sm">Pregúntame sobre servicios</p>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4">
                        <p className="text-zinc-400 text-sm mb-3">¿En qué puedo ayudarte hoy?</p>
                        <div className="space-y-2">
                            <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                💬 Consultar precios
                            </button>
                            <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                📅 Agendar cita
                            </button>
                            <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                📸 Ver portafolio
                            </button>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg p-4">
                        <h4 className="text-white font-medium">Recomendación IA</h4>
                        <p className="text-white/80 text-sm">Basado en tus intereses</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
