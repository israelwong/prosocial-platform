export default function StudioPortfolio({
    params
}: {
    params: { slug: string; 'portfolio-slug': string }
}) {
    return (
        <div>
            <h1>Portfolio - {params.slug}</h1>
            <p>Portfolio: {params['portfolio-slug']}</p>
        </div>
    );
}
