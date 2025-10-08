export default function ManagerEventoGantt({
    params
}: {
    params: { slug: string; id: string }
}) {
    return (
        <div>
            <h1>Gantt del Evento - {params.slug}</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
