export default function StudioPaquetes({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Paquetes - {params.slug}</h1>
            <p>Catálogo de paquetes del estudio</p>
        </div>
    );
}
