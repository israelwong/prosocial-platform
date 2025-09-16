import React from 'react'
import { useSocialMedia } from '@/hooks/usePlatformConfig'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

interface SocialMediaLinksProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

export function SocialMediaLinks({ 
  className = '', 
  size = 'md', 
  showLabels = false 
}: SocialMediaLinksProps) {
  const socialMedia = useSocialMedia()

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const socialLinks = [
    {
      name: 'Facebook',
      url: socialMedia.facebook,
      icon: Facebook,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      url: socialMedia.instagram,
      icon: Instagram,
      color: 'hover:text-pink-400'
    },
    {
      name: 'Twitter',
      url: socialMedia.twitter,
      icon: Twitter,
      color: 'hover:text-blue-300'
    },
    {
      name: 'LinkedIn',
      url: socialMedia.linkedin,
      icon: Linkedin,
      color: 'hover:text-blue-500'
    }
  ]

  const availableLinks = socialLinks.filter(link => link.url)

  if (availableLinks.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {availableLinks.map(({ name, url, icon: Icon, color }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center space-x-2 text-zinc-400 transition-colors ${color}`}
          aria-label={`Síguenos en ${name}`}
        >
          <Icon className={sizeClasses[size]} />
          {showLabels && <span className="text-sm">{name}</span>}
        </a>
      ))}
    </div>
  )
}

export default SocialMediaLinks
