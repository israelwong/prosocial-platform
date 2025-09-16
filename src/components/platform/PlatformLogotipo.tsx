"use client";

import React from 'react';
import NextImage from 'next/image';
import { usePlatformBranding } from '@/hooks/usePlatformConfig';

interface PlatformLogotipoProps {
    width?: number;
    height?: number;
    className?: string;
    textClassName?: string;
    showText?: boolean;
    fallbackSrc?: string;
}

export function PlatformLogotipo({ 
    width = 32, 
    height = 32, 
    className = "",
    textClassName = "text-lg font-semibold text-white",
    showText = true,
    fallbackSrc = "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg"
}: PlatformLogotipoProps) {
    const { logotipo, nombre } = usePlatformBranding();

    const logoSrc = logotipo || fallbackSrc;
    const altText = `${nombre} - Logotipo`;

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <NextImage
                src={logoSrc}
                alt={altText}
                width={width}
                height={height}
                className="h-auto"
                priority
            />
            {showText && (
                <h1 className={textClassName}>
                    {nombre}
                </h1>
            )}
        </div>
    );
}
