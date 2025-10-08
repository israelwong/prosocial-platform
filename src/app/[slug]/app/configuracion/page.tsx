export default function ConfiguracionMain({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Configuración - {params.slug}</h1>
            <p>Panel de configuración del estudio</p>
        </div>
    );
}
