'use client';

import { MainSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function InicioPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por MainSection
    const portfolios = profileData.portfolios || [];
    
    return <MainSection portfolios={portfolios} />;
}
