export default function StudioAppDashboard({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Dashboard - {params.slug}</h1>
            <p>Panel principal del estudio</p>
        </div>
    );
}
