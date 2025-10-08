export default function StudioMagic({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>ZEN Magic - {params.slug}</h1>
            <p>Asistente de IA para el estudio</p>
        </div>
    );
}
