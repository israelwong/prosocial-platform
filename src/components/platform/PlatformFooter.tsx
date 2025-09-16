import React from 'react'
import { useCompanyInfo, useCommercialContact, useSupportContact } from '@/hooks/usePlatformConfig'
import { ContactInfo } from './ContactInfo'
import { SocialMediaLinks } from './SocialMediaLinks'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'

interface PlatformFooterProps {
  className?: string
}

export function PlatformFooter({ className = '' }: PlatformFooterProps) {
  const company = useCompanyInfo()
  const commercial = useCommercialContact()
  const support = useSupportContact()

  return (
    <footer className={`bg-zinc-900 border-t border-zinc-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{company.nombre}</h3>
            <p className="text-zinc-400 text-sm">
              Plataforma integral para la gestión de estudios de fotografía
            </p>
            
            {company.direccion && (
              <div className="flex items-start space-x-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{company.direccion}</span>
              </div>
            )}
            
            {company.horarios && (
              <div className="flex items-start space-x-2 text-zinc-400 text-sm">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{company.horarios}</span>
              </div>
            )}
          </div>

          {/* Contacto comercial */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-white">Contacto Comercial</h4>
            
            {commercial.telefono && (
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>{commercial.telefono}</span>
              </div>
            )}
            
            {commercial.email && (
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" />
                <a 
                  href={`mailto:${commercial.email}`}
                  className="hover:text-white transition-colors"
                >
                  {commercial.email}
                </a>
              </div>
            )}
          </div>

          {/* Soporte técnico */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-white">Soporte Técnico</h4>
            
            {support.telefono && (
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>{support.telefono}</span>
              </div>
            )}
            
            {support.email && (
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" />
                <a 
                  href={`mailto:${support.email}`}
                  className="hover:text-white transition-colors"
                >
                  {support.email}
                </a>
              </div>
            )}
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-white">Síguenos</h4>
            <SocialMediaLinks showLabels={true} />
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} {company.nombre}. Todos los derechos reservados.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <a 
                href="/terms" 
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Términos y Condiciones
              </a>
              <a 
                href="/privacy" 
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PlatformFooter
