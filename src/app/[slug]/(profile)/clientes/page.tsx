'use client';

import { ClientsSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function ClientesPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por ClientsSection
    const studio = {
        studio_name: profileData.studio_name,
        slogan: profileData.slogan,
        description: profileData.description,
        logo_url: profileData.logo_url
    };
    
    return <ClientsSection studio={studio} />;
}
