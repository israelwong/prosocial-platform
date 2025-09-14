'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserRole, getDefaultRoute } from '@/types/auth'

interface User {
    id: string
    email: string
}


export function CompleteProfileForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<UserRole | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getUserAndProfile = async () => {
            if (!isInitializing) return // Evitar múltiples ejecuciones

            const supabase = createClient()

            try {
                // Obtener el usuario autenticado
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/auth/login')
                    return
                }

                setUser({ id: user.id, email: user.email || '' })

                // Verificar si ya existe un perfil para este usuario
                const { data: profile, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    console.error('Error obteniendo perfil:', error)
                    setError('Error al obtener información del perfil')
                    return
                }

                if (profile) {
                    // Si ya existe un perfil, redirigir según el rol
                    const userRole = profile.role as UserRole
                    const redirectPath = getDefaultRoute(userRole, profile.studioId)
                    router.push(redirectPath)
                    return
                }

                // Si no existe perfil, verificar si el usuario tiene un rol predefinido
                // Esto puede venir de la tabla prosocial_agents o user_profiles
                const { data: agentData } = await supabase
                    .from('prosocial_agents')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (agentData) {
                    // El usuario es un agente
                    setRole(UserRole.AGENTE)
                } else {
                    // Por defecto, es un suscriptor
                    setRole(UserRole.SUSCRIPTOR)
                }
            } catch (error) {
                console.error('Error en getUserAndProfile:', error)
                setError('Error al obtener información del usuario')
            } finally {
                setIsInitializing(false)
            }
        }

        if (isInitializing) {
            getUserAndProfile()
        }
    }, [router, isInitializing])

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !role) return

        setIsLoading(true)
        setError(null)

        try {
            console.log('🔍 Creating user profile with data:', {
                id: user.id,
                email: user.email,
                fullName: fullName,
                role: role,
            })

            // Usar una API route para crear el perfil (bypass RLS)
            const response = await fetch('/api/auth/create-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    fullName: fullName,
                    role: role,
                }),
            })

            const result = await response.json()
            console.log('📊 API response:', result)

            if (!response.ok) {
                throw new Error(result.error || 'Error creating profile')
            }

            console.log('✅ Profile created successfully:', result.data)

            // Redirigir según el rol
            const redirectPath = getDefaultRoute(role)
            console.log('🚀 Redirecting to:', redirectPath)
            router.push(redirectPath)

        } catch (error: unknown) {
            console.error('❌ Complete profile error:', error)
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    if (isInitializing || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">
                        {isInitializing ? 'Verificando información...' : 'Cargando...'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-center">Completar Perfil</CardTitle>
                    <CardDescription className="text-center">
                        Completa tu información personal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCompleteProfile}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Nombre Completo</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Tipo de Cuenta</Label>
                                <div className="p-3 bg-gray-50 border rounded-md">
                                    <div className="flex items-center gap-2">
                                        {role === UserRole.AGENTE && (
                                            <>
                                                <span className="text-2xl">💼</span>
                                                <span className="font-medium">Agente ProSocial</span>
                                            </>
                                        )}
                                        {role === UserRole.SUSCRIPTOR && (
                                            <>
                                                <span className="text-2xl">📸</span>
                                                <span className="font-medium">Suscriptor (Estudio de Fotografía)</span>
                                            </>
                                        )}
                                        {role === UserRole.SUPER_ADMIN && (
                                            <>
                                                <span className="text-2xl">🔧</span>
                                                <span className="font-medium">Super Administrador</span>
                                            </>
                                        )}
                                        {!role && (
                                            <span className="text-gray-500">Determinando tipo de cuenta...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Completando perfil...' : 'Completar Perfil'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
