export default function AgenteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1>Panel de Agente</h1>
            {children}
        </div>
    );
}
