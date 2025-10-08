export default function StudioDashboard({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Dashboard - {params.slug}</h1>
            <p>Vista general del estudio</p>
        </div>
    );
}
