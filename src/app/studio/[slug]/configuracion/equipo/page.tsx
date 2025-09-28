import { Suspense } from 'react';
import { PersonalList } from './components/PersonalList';

interface PageProps {
    params: {
        slug: string;
    };
}

export default function EquipoPage({ params }: PageProps) {
    return (
        <div className="space-y-6">
            <Suspense fallback={<div>Cargando personal...</div>}>
                <PersonalList studioSlug={params.slug} />
            </Suspense>
        </div>
    );
}
