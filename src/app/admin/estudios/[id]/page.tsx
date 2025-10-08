export default function AdminEstudioDetail({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Detalle del Estudio</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
