export default function PagesPortfolios({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Gestión de Portfolios - {params.slug}</h1>
            <p>Administra portfolios del estudio</p>
        </div>
    );
}
