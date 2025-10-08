export default function MarketingLeads({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Leads de Marketing - {params.slug}</h1>
            <p>Administra leads de marketing</p>
        </div>
    );
}
