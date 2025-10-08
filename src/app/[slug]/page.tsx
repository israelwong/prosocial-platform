export default async function StudioHome({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <div>
            <h1>Estudio: {slug}</h1>
            <p>Página principal del estudio</p>
        </div>
    );
}
