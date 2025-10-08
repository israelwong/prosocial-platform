export default function ConfiguracionCuenta({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Configuración de Cuenta - {params.slug}</h1>
            <p>Configura tu cuenta personal</p>
        </div>
    );
}
