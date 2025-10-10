import React from 'react';
import { ProfileTab, PublicProfileData } from '@/types/public-profile';
import { PostGridView } from './PostGridView';
import { ShopView } from './ShopView';
import { InfoView } from './InfoView';

interface ProfileContentViewProps {
    activeTab: ProfileTab;
    profileData: PublicProfileData;
}

/**
 * ProfileContentView - Container that switches between different views
 * Renders the appropriate view based on active tab
 * Handles tab switching logic
 */
export function ProfileContentView({ activeTab, profileData }: ProfileContentViewProps) {
    const { studio, socialNetworks, contactInfo, items, portfolios } = profileData;

    switch (activeTab) {
        case ProfileTab.POSTS:
            return <PostGridView portfolios={portfolios} />;

        case ProfileTab.SHOP:
            return <ShopView items={items} />;

        case ProfileTab.INFO:
            return (
                <InfoView
                    studio={studio}
                    contactInfo={contactInfo}
                    socialNetworks={socialNetworks}
                />
            );

        default:
            return <PostGridView portfolios={portfolios} />;
    }
}
