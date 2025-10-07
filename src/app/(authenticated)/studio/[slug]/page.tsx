export default function StudioPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-purple-400">
        Studio: {params.slug}
      </h1>
      <p className="text-zinc-400">
        Panel del estudio - En desarrollo
      </p>
    </div>
  );
}
