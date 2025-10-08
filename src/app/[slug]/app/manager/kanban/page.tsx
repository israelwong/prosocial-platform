export default function ManagerKanban({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Kanban de Eventos - {params.slug}</h1>
            <p>Gestiona eventos en el pipeline</p>
        </div>
    );
}
