export default function ConfiguracionEstudio({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Configuración del Estudio - {params.slug}</h1>
            <p>Configura datos del estudio</p>
        </div>
    );
}
