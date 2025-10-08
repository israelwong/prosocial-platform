export default function AgenteLeadDetail({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Detalle del Lead</h1>
            <p>ID: {params.id}</p>
        </div>
    );
}
