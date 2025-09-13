'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClientSupabase } from '@/lib/supabase'

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

    useEffect(() => {
        // Create Supabase client only on client side
        const client = createClientSupabase()
        setSupabase(client)
    }, [])

    useEffect(() => {
        if (!supabase) return

        // Obtener sesión inicial
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
