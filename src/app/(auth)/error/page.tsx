import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Button } from '@/components/ui/shadcn/button'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            Hubo un problema al confirmar tu cuenta. Esto puede deberse a:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• El enlace de confirmación ha expirado</li>
            <li>• El enlace ya ha sido utilizado</li>
            <li>• El enlace es inválido o está malformado</li>
          </ul>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">
                Ir al Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-up">
                Crear Nueva Cuenta
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}