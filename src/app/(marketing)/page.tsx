export default function MarketingPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-emerald-400 mb-4">
        ZEN Platform
      </h1>
      <p className="text-xl text-zinc-400 mb-8">
        Plataforma modular para estudios fotográficos
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-emerald-400 mb-2">
            ZEN Manager
          </h3>
          <p className="text-zinc-400 text-sm">
            Gestión completa de eventos y clientes
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            ZEN Magic
          </h3>
          <p className="text-zinc-400 text-sm">
            Inteligencia artificial para fotografía
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            ZEN Marketing
          </h3>
          <p className="text-zinc-400 text-sm">
            CRM y automatización de marketing
          </p>
        </div>
      </div>
    </div>
  );
}
