'use client';

import { ContactSection } from '@/components/ui/profile/sections';
import { useStudio } from '@/contexts/StudioContext';

export default function ContactoPage() {
    const { profileData } = useStudio();
    
    // Convertir datos del Context al formato esperado por ContactSection
    const studio = {
        studio_name: profileData.studio_name,
        slogan: profileData.slogan,
        description: profileData.description,
        logo_url: profileData.logo_url
    };
    
    const contactInfo = {
        email: profileData.email,
        phones: profileData.phones,
        address: profileData.address,
        business_hours: profileData.business_hours,
        social_networks: profileData.social_networks
    };
    
    return <ContactSection studio={studio} contactInfo={contactInfo} />;
}
