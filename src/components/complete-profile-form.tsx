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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserRole, getDefaultRoute } from '@/types/auth'

export function CompleteProfileForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<UserRole>(UserRole.SUSCRIPTOR)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        const supabase = createClient()
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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Completar Perfil</CardTitle>
                    <CardDescription>
                        Completa tu información para acceder a la plataforma
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
                                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserRole.SUSCRIPTOR}>
                                            📸 Suscriptor (Estudio de Fotografía)
                                        </SelectItem>
                                        <SelectItem value={UserRole.ASESOR}>
                                            💼 Asesor ProSocial
                                        </SelectItem>
                                        <SelectItem value={UserRole.SUPER_ADMIN}>
                                            🔧 Super Administrador
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
