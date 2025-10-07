export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 max-w-md w-full">
        <h1 className="text-2xl font-bold text-emerald-400 mb-4">
          Iniciar Sesión
        </h1>
        <p className="text-zinc-400 mb-6">
          Ingresa a tu cuenta para acceder al panel de administración
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="admin@prosocial.mx"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-medium">
            Iniciar Sesión
          </button>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">
          Sistema de autenticación en desarrollo
        </p>
      </div>
    </div>
  );
}
