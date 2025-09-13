import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Force dynamic rendering to avoid build-time Supabase client creation
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-900">
            ProSocial Platform
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            La plataforma que necesitas para
            <span className="text-blue-600"> hacer crecer tu estudio</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gestiona proyectos, cotizaciones y clientes. Revenue share
            automático. Sin complicaciones técnicas.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">Comenzar Gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#planes">Ver Planes</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Multi-tenant</CardTitle>
              <CardDescription>
                Tu propio espacio aislado con URL personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                prosocial.mx/tu-estudio/ - Tu marca, tu espacio.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Share</CardTitle>
              <CardDescription>
                Monetiza servicios adicionales automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                70% para ti, 30% para la plataforma. Simple y transparente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sin Límites</CardTitle>
              <CardDescription>
                Escalabilidad real para tu crecimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Desde 5 hasta 50+ proyectos activos según tu plan.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <div id="planes" className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Planes que crecen contigo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Para estudios que empiezan</CardDescription>
                <div className="text-3xl font-bold">
                  $29<span className="text-sm">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ 5 proyectos activos</li>
                  <li>✓ URL personalizada</li>
                  <li>✓ Gestión básica</li>
                  <li>✓ Revenue share 70/30</li>
                </ul>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card className="relative border-blue-500 border-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Más Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Para estudios establecidos</CardDescription>
                <div className="text-3xl font-bold">
                  $79<span className="text-sm">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ 15 proyectos activos</li>
                  <li>✓ Analytics avanzado</li>
                  <li>✓ Automatizaciones</li>
                  <li>✓ Revenue share 70/30</li>
                  <li>✓ Soporte prioritario</li>
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Para estudios grandes</CardDescription>
                <div className="text-3xl font-bold">
                  $199<span className="text-sm">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✓ 50 proyectos activos</li>
                  <li>✓ Dominio personalizado</li>
                  <li>✓ API acceso</li>
                  <li>✓ Revenue share 70/30</li>
                  <li>✓ Soporte dedicado</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 ProSocial Platform. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
