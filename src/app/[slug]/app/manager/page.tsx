export default function ManagerDashboard({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>ZEN Manager - {params.slug}</h1>
            <p>Panel de gestión de eventos</p>
        </div>
    );
}
