export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">
          Área Autenticada
        </h2>
        {children}
      </div>
    </div>
  );
}
