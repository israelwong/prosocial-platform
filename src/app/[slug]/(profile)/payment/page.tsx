'use client';

import { PaymentsSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function PaymentPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por PaymentsSection
    const studio = {
        studio_name: profileData.studio_name,
        slogan: profileData.slogan,
        description: profileData.description,
        logo_url: profileData.logo_url
    };
    
    return <PaymentsSection studio={studio} />;
}
