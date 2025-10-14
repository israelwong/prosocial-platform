'use client';

import { CatalogSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function PaquetesPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por CatalogSection
    const items = profileData.items || [];
    
    return <CatalogSection items={items} />;
}
