'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">ProSocial Platform</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicia sesión en tu cuenta
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales para acceder al panel de administración
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@prosocial.mx"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                ¿No tienes cuenta?{' '}
                                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
