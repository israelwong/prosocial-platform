import { useState, useEffect } from 'react'

export interface PlatformConfig {
  id: string | null
  nombre_empresa: string
  logo_url: string | null
  favicon_url: string | null
  comercial_telefono: string | null
  comercial_email: string | null
  comercial_whatsapp: string | null
  soporte_telefono: string | null
  soporte_email: string | null
  soporte_chat_url: string | null
  direccion: string | null
  horarios_atencion: string | null
  timezone: string
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  terminos_condiciones: string | null
  politica_privacidad: string | null
  aviso_legal: string | null
  meta_description: string | null
  meta_keywords: string | null
  google_analytics_id: string | null
  google_tag_manager_id: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface UsePlatformConfigReturn {
  config: PlatformConfig | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateConfig: (newConfig: Partial<PlatformConfig>) => Promise<void>
}

export function usePlatformConfig(): UsePlatformConfigReturn {
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/platform-config')
      
      if (!response.ok) {
        throw new Error('Error al obtener la configuración')
      }
      
      const data = await response.json()
      setConfig(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching platform config:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (newConfig: Partial<PlatformConfig>) => {
    try {
      setError(null)
      
      const response = await fetch('/api/platform-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar la configuración')
      }
      
      const updatedConfig = await response.json()
      setConfig(updatedConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error updating platform config:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
    updateConfig,
  }
}

// Hook para obtener solo campos específicos
export function usePlatformConfigField<T extends keyof PlatformConfig>(
  field: T
): PlatformConfig[T] | null {
  const { config } = usePlatformConfig()
  return config?.[field] || null
}

// Hook para obtener información de contacto comercial
export function useCommercialContact() {
  const { config } = usePlatformConfig()
  
  return {
    telefono: config?.comercial_telefono,
    email: config?.comercial_email,
    whatsapp: config?.comercial_whatsapp,
  }
}

// Hook para obtener información de contacto de soporte
export function useSupportContact() {
  const { config } = usePlatformConfig()
  
  return {
    telefono: config?.soporte_telefono,
    email: config?.soporte_email,
    chat_url: config?.soporte_chat_url,
  }
}

// Hook para obtener información de la empresa
export function useCompanyInfo() {
  const { config } = usePlatformConfig()
  
  return {
    nombre: config?.nombre_empresa,
    logo: config?.logo_url,
    direccion: config?.direccion,
    horarios: config?.horarios_atencion,
  }
}

// Hook para obtener redes sociales
export function useSocialMedia() {
  const { config } = usePlatformConfig()
  
  return {
    facebook: config?.facebook_url,
    instagram: config?.instagram_url,
    twitter: config?.twitter_url,
    linkedin: config?.linkedin_url,
  }
}
