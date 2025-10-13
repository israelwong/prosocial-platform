import React from 'react';
import TikTokIcon from './TikTokIcon';
import FacebookIcon from './FacebookIcon';
import InstagramIcon from './InstagramIcon';
import ThreadsIcon from './ThreadsIcon';
import YouTubeIcon from './YouTubeIcon';
import LinkedInIcon from './LinkedInIcon';
import SpotifyIcon from './SpotifyIcon';

interface RedSocialIconProps {
    icono: string;
    className?: string;
    size?: number;
}

export function RedSocialIcon({ icono, className = "w-5 h-5", size }: RedSocialIconProps) {
    // Mapeo de iconos a componentes
    const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
        facebook: FacebookIcon,
        instagram: InstagramIcon,
        threads: ThreadsIcon,
        youtube: YouTubeIcon,
        tiktok: TikTokIcon,
        linkedin: LinkedInIcon,
        spotify: SpotifyIcon
    };

    const IconComponent = iconMap[icono];

    if (IconComponent) {
        return <IconComponent className={className} size={size} />;
    }

    // Fallback para iconos no encontrados
    return (
        <span className={className} style={{ fontSize: size ? `${size}px` : undefined }}>
            📱
        </span>
    );
}
