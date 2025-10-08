export default function ManagerEventoDetail({
    params
}: {
    params: { slug: string; id: string }
}) {
    return (
        <div>
            <h1>Detalle del Evento - {params.slug}</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
