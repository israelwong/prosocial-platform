'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/shadcn/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function LogoutButton({ 
  className, 
  variant = 'ghost', 
  size = 'default' 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error al cerrar sesión:', error)
        return
      }

      // Redirigir al login
      router.push('/login')
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </Button>
  )
}