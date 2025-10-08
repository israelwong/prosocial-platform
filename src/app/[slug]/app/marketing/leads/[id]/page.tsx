export default function MarketingLeadDetail({
    params
}: {
    params: { slug: string; id: string }
}) {
    return (
        <div>
            <h1>Detalle del Lead - {params.slug}</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
