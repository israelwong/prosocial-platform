export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1>Panel de Administración</h1>
            {children}
        </div>
    );
}
