export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 p-4">
        <h1 className="text-xl font-bold text-emerald-400">
          ZEN Marketing
        </h1>
      </nav>
      {children}
    </div>
  );
}
