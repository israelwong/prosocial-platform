export default function PagesEditor({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Editor de Páginas - {params.slug}</h1>
            <p>Editor de páginas web</p>
        </div>
    );
}
