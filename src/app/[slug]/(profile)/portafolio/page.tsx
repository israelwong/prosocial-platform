'use client';

import { PortfolioSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function PortafolioPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por PortfolioSection
    const portfolios = profileData.portfolios || [];
    
    return <PortfolioSection portfolios={portfolios} />;
}
