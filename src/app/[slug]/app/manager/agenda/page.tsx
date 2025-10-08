export default function ManagerAgenda({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Agenda - {params.slug}</h1>
            <p>Vista de calendario y agenda</p>
        </div>
    );
}
