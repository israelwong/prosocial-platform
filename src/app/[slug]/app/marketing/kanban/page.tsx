export default function MarketingKanban({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Kanban de Marketing - {params.slug}</h1>
            <p>Gestiona leads de marketing</p>
        </div>
    );
}
