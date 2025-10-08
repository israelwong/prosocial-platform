export default function ConfiguracionModulo({
    params
}: {
    params: { slug: string; modulo: string }
}) {
    return (
        <div>
            <h1>Configuración del Módulo - {params.slug}</h1>
            <p>Módulo: {params.modulo}</p>
        </div>
    );
}
