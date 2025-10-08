export default function MarketingCotizaciones({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Cotizaciones de Marketing - {params.slug}</h1>
            <p>Administra cotizaciones de marketing</p>
        </div>
    );
}
