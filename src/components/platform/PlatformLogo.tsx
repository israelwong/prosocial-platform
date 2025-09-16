"use client";

import React from 'react';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';
import { PlatformIsotipo } from './PlatformIsotipo';
import { PlatformLogotipo } from './PlatformLogotipo';

interface PlatformLogoProps {
    width?: number;
    height?: number;
    className?: string;
    showText?: boolean;
    textClassName?: string;
    fallbackSrc?: string;
    type?: 'isotipo' | 'logotipo' | 'auto';
}

export function PlatformLogo({ 
    width = 32, 
    height = 32, 
    className = "",
    showText = false,
    textClassName = "text-lg font-semibold text-white",
    fallbackSrc = "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
    type = 'auto'
}: PlatformLogoProps) {
    const { loading } = usePlatformConfig();

    if (loading) {
        return (
            <div className={`flex items-center space-x-3 ${className}`}>
                <div className={`bg-zinc-700 animate-pulse rounded`} style={{ width, height }} />
                {showText && (
                    <div className="bg-zinc-700 animate-pulse rounded h-6 w-32" />
                )}
            </div>
        );
    }

    // Determinar el tipo basado en showText si es 'auto'
    const logoType = type === 'auto' ? (showText ? 'logotipo' : 'isotipo') : type;

    if (logoType === 'isotipo') {
        return (
            <PlatformIsotipo
                width={width}
                height={height}
                className={className}
                fallbackSrc={fallbackSrc}
            />
        );
    }

    return (
        <PlatformLogotipo
            width={width}
            height={height}
            className={className}
            textClassName={textClassName}
            showText={showText}
            fallbackSrc={fallbackSrc}
        />
    );
}
