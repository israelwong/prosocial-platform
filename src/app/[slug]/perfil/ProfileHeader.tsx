import React from 'react';
import { ZenAvatar, ZenBadge } from '@/components/ui/zen';
import { PublicStudioProfile, ProfileStats } from '@/types/public-profile';

interface ProfileHeaderProps {
    studio: PublicStudioProfile;
    stats: ProfileStats;
}

/**
 * ProfileHeader - Studio identity and stats display
 * Uses ZenAvatar and ZenBadge from ZEN Design System
 */
export function ProfileHeader({ studio, stats }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col items-center space-y-4 p-6">
            {/* Avatar */}
            <div className="relative">
                <ZenAvatar
                    src={studio.logo_url || undefined}
                    alt={`${studio.studio_name} logo`}
                    className="h-24 w-24 border-4 border-zinc-800"
                />
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-zinc-950" />
            </div>

            {/* Studio Info */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-zinc-100">
                    {studio.studio_name}
                </h1>

                {studio.slogan && (
                    <p className="text-zinc-400 text-sm">
                        {studio.slogan}
                    </p>
                )}

                {studio.description && (
                    <p className="text-zinc-300 text-sm max-w-md">
                        {studio.description}
                    </p>
                )}

                {/* Website Link */}
                {studio.website && (
                    <a
                        href={studio.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm underline"
                    >
                        {studio.website}
                    </a>
                )}
            </div>

            {/* Stats */}
            <div className="flex space-x-6">
                <div className="text-center">
                    <div className="text-xl font-bold text-zinc-100">
                        {stats.postsCount}
                    </div>
                    <div className="text-xs text-zinc-400">Publicaciones</div>
                </div>

                <div className="text-center">
                    <div className="text-xl font-bold text-zinc-100">
                        {stats.followersCount}
                    </div>
                    <div className="text-xs text-zinc-400">Seguidores</div>
                </div>
            </div>

            {/* Status Badge */}
            <ZenBadge
                variant="default"
                className="bg-green-500/20 text-green-400 border-green-500/30"
            >
                En línea
            </ZenBadge>
        </div>
    );
}
