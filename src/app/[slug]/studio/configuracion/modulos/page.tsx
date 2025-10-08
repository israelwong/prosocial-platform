export default function ConfiguracionModulos({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Gestión de Módulos - {params.slug}</h1>
            <p>Administra módulos activos</p>
        </div>
    );
}
