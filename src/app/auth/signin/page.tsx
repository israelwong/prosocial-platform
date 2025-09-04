'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useStudioAuth } from '@/hooks/use-studio-auth'

function SignInForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const router = useRouter()
    const searchParams = useSearchParams()
    const studioSlug = searchParams.get('studio')
    const callbackUrl = searchParams.get('callbackUrl')

    const { signIn, user, studioUser } = useStudioAuth()

    useEffect(() => {
        if (user && studioUser) {
            // Redirigir al dashboard del studio
            router.push(callbackUrl || `/${studioUser.studioSlug}`)
        }
    }, [user, studioUser, router, callbackUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const { data, error } = await signIn(email, password)

            if (error) {
                setError(error.message)
            } else if (data.user) {
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
                // La redirección se maneja en el useEffect
            }
        } catch {
            setError('Error inesperado. Por favor, intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                    <CardDescription>
                        {studioSlug
                            ? `Accede a tu cuenta de ${studioSlug}`
                            : 'Accede a tu cuenta de ProSocial Platform'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tu contraseña"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Credenciales de prueba:
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Email: admin@prosocial-events.com
                        </p>
                        <p className="text-xs text-gray-500">
                            Contraseña: admin123
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <SignInForm />
        </Suspense>
    )
}