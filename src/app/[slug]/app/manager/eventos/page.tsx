export default function ManagerEventos({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Gestión de Eventos - {params.slug}</h1>
            <p>Administra todos los eventos</p>
        </div>
    );
}
