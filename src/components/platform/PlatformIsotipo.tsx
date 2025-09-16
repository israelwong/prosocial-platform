"use client";

import React from 'react';
import NextImage from 'next/image';
import { usePlatformBranding } from '@/hooks/usePlatformConfig';

interface PlatformIsotipoProps {
    width?: number;
    height?: number;
    className?: string;
    fallbackSrc?: string;
}

export function PlatformIsotipo({ 
    width = 32, 
    height = 32, 
    className = "",
    fallbackSrc = "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg"
}: PlatformIsotipoProps) {
    const { isotipo, nombre } = usePlatformBranding();

    const logoSrc = isotipo || fallbackSrc;
    const altText = `${nombre} - Isotipo`;

    return (
        <NextImage
            src={logoSrc}
            alt={altText}
            width={width}
            height={height}
            className={`h-auto ${className}`}
            priority
            onError={(e) => {
                // Si falla la imagen, usar fallback
                const target = e.target as HTMLImageElement;
                if (target.src !== fallbackSrc) {
                    target.src = fallbackSrc;
                }
            }}
        />
    );
}
