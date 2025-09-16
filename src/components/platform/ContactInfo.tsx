import React from 'react'
import { useCommercialContact, useSupportContact, useCompanyInfo } from '@/hooks/usePlatformConfig'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

interface ContactInfoProps {
  type?: 'commercial' | 'support' | 'both'
  className?: string
}

export function ContactInfo({ type = 'both', className = '' }: ContactInfoProps) {
  const commercial = useCommercialContact()
  const support = useSupportContact()
  const company = useCompanyInfo()

  if (type === 'commercial') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-white">Contacto Comercial</h3>
        
        {commercial.telefono && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <Phone className="h-4 w-4" />
            <span>{commercial.telefono}</span>
          </div>
        )}
        
        {commercial.email && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <Mail className="h-4 w-4" />
            <span>{commercial.email}</span>
          </div>
        )}
        
        {commercial.whatsapp && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <MessageCircle className="h-4 w-4" />
            <span>{commercial.whatsapp}</span>
          </div>
        )}
      </div>
    )
  }

  if (type === 'support') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-white">Soporte Técnico</h3>
        
        {support.telefono && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <Phone className="h-4 w-4" />
            <span>{support.telefono}</span>
          </div>
        )}
        
        {support.email && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <Mail className="h-4 w-4" />
            <span>{support.email}</span>
          </div>
        )}
        
        {support.chat_url && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <MessageCircle className="h-4 w-4" />
            <a 
              href={support.chat_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Chat en vivo
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Información de la empresa */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">{company.nombre}</h3>
        
        {company.direccion && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <MapPin className="h-4 w-4" />
            <span>{company.direccion}</span>
          </div>
        )}
        
        {company.horarios && (
          <div className="flex items-center space-x-2 text-zinc-300">
            <Clock className="h-4 w-4" />
            <span>{company.horarios}</span>
          </div>
        )}
      </div>

      {/* Contacto comercial */}
      <ContactInfo type="commercial" />

      {/* Contacto de soporte */}
      <ContactInfo type="support" />
    </div>
  )
}

export default ContactInfo
