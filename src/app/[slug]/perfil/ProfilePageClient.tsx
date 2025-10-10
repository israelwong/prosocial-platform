'use client';

import React, { useState } from 'react';
import { ProfileTab, PublicProfileData } from '@/types/public-profile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileNavTabs } from './ProfileNavTabs';
import { ProfileContentView } from './ProfileContentView';
import { HeroCTA } from './HeroCTA';
import { ZenAIChat } from './ZenAIChat';
import { getProfileStats, isProPlan } from '@/lib/utils/profile-utils';

interface ProfilePageClientProps {
    profileData: PublicProfileData;
}

/**
 * ProfilePageClient - Main client component for public profile
 * Manages tab state and 3-column responsive layout
 * Mobile-first design that expands to desktop
 */
export function ProfilePageClient({ profileData }: ProfilePageClientProps) {
    const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.POSTS);

    const { studio, portfolios } = profileData;
    const stats = getProfileStats(portfolios);
    const isPro = isProPlan(studio.plan?.slug);

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Mobile Layout (default) */}
            <div className="lg:hidden">
                {/* Profile Header */}
                <ProfileHeader studio={studio} stats={stats} />

                {/* Navigation Tabs */}
                <ProfileNavTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Content View */}
                <ProfileContentView
                    activeTab={activeTab}
                    profileData={profileData}
                />
            </div>

            {/* Desktop Layout (3 columns) */}
            <div className="hidden lg:grid lg:grid-cols-[400px_1fr_380px] lg:gap-6 lg:p-6">
                {/* Column 1: Profile Content */}
                <div className="space-y-6">
                    {/* Profile Header */}
                    <ProfileHeader studio={studio} stats={stats} />

                    {/* Navigation Tabs */}
                    <ProfileNavTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Content View */}
                    <ProfileContentView
                        activeTab={activeTab}
                        profileData={profileData}
                    />
                </div>

                {/* Column 2: Hero CTA (sticky) */}
                <div className="lg:sticky lg:top-6 lg:h-fit">
                    <HeroCTA />
                </div>

                {/* Column 3: AI Chat (sticky) */}
                <div className="lg:sticky lg:top-6 lg:h-fit">
                    <ZenAIChat isProPlan={isPro} />
                </div>
            </div>
        </div>
    );
}
