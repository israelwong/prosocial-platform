"use client";

import React from 'react';
import { usePlatformSocialMedia } from '@/hooks/usePlatformConfig';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface SocialMediaLinksProps {
    className?: string;
    iconSize?: number;
    showLabels?: boolean;
}

export function SocialMediaLinks({ 
    className = "",
    iconSize = 20,
    showLabels = false 
}: SocialMediaLinksProps) {
    const socialMedia = usePlatformSocialMedia();

    const socialLinks = [
        { 
            name: 'Facebook', 
            url: socialMedia.facebook, 
            icon: Facebook,
            color: 'hover:text-blue-500'
        },
        { 
            name: 'Instagram', 
            url: socialMedia.instagram, 
            icon: Instagram,
            color: 'hover:text-pink-500'
        },
        { 
            name: 'Twitter', 
            url: socialMedia.twitter, 
            icon: Twitter,
            color: 'hover:text-blue-400'
        },
        { 
            name: 'LinkedIn', 
            url: socialMedia.linkedin, 
            icon: Linkedin,
            color: 'hover:text-blue-600'
        },
    ].filter(link => link.url); // Solo mostrar redes que tienen URL

    if (socialLinks.length === 0) {
        return null;
    }

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {socialLinks.map(({ name, url, icon: Icon, color }) => (
                <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-zinc-400 transition-colors ${color}`}
                    title={name}
                >
                    <Icon size={iconSize} />
                    {showLabels && (
                        <span className="ml-2 text-sm">{name}</span>
                    )}
                </a>
            ))}
        </div>
    );
}