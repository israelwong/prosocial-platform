import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlataformasPublicidad() {
    console.log('🌱 Seeding plataformas de publicidad...');

    const plataformas = [
        // REDES SOCIALES
        {
            nombre: 'Facebook Ads',
            descripcion: 'Publicidad en Facebook',
            tipo: 'Redes Sociales',
            color: '#1877F2',
            icono: 'Facebook',
            orden: 1
        },
        {
            nombre: 'Instagram Ads',
            descripcion: 'Publicidad en Instagram',
            tipo: 'Redes Sociales',
            color: '#E4405F',
            icono: 'Instagram',
            orden: 2
        },
        {
            nombre: 'TikTok Ads',
            descripcion: 'Publicidad en TikTok',
            tipo: 'Redes Sociales',
            color: '#000000',
            icono: 'Music',
            orden: 3
        },
        {
            nombre: 'LinkedIn Ads',
            descripcion: 'Publicidad en LinkedIn',
            tipo: 'Redes Sociales',
            color: '#0A66C2',
            icono: 'Linkedin',
            orden: 4
        },
        {
            nombre: 'Twitter/X Ads',
            descripcion: 'Publicidad en Twitter/X',
            tipo: 'Redes Sociales',
            color: '#1DA1F2',
            icono: 'Twitter',
            orden: 5
        },

        // BÚSQUEDA
        {
            nombre: 'Google Ads',
            descripcion: 'Publicidad en Google Search',
            tipo: 'Búsqueda',
            color: '#4285F4',
            icono: 'Search',
            orden: 6
        },
        {
            nombre: 'Bing Ads',
            descripcion: 'Publicidad en Microsoft Bing',
            tipo: 'Búsqueda',
            color: '#0078D4',
            icono: 'Search',
            orden: 7
        },

        // VIDEO
        {
            nombre: 'YouTube Ads',
            descripcion: 'Publicidad en YouTube',
            tipo: 'Video',
            color: '#FF0000',
            icono: 'Play',
            orden: 8
        },
        {
            nombre: 'TikTok Video Ads',
            descripcion: 'Publicidad de video en TikTok',
            tipo: 'Video',
            color: '#000000',
            icono: 'Video',
            orden: 9
        },

        // DISPLAY
        {
            nombre: 'Google Display',
            descripcion: 'Red de display de Google',
            tipo: 'Display',
            color: '#4285F4',
            icono: 'Monitor',
            orden: 10
        },
        {
            nombre: 'Facebook Audience Network',
            descripcion: 'Red de audiencia de Facebook',
            tipo: 'Display',
            color: '#1877F2',
            icono: 'Globe',
            orden: 11
        }
    ];

    for (const plataformaData of plataformas) {
        const plataforma = await prisma.proSocialPlataformaPublicidad.upsert({
            where: { nombre: plataformaData.nombre },
            update: plataformaData,
            create: plataformaData,
        });
        console.log(`✅ Plataforma creada/actualizada: ${plataforma.nombre} (${plataforma.tipo})`);
    }

    console.log('🎉 Plataformas de publicidad seeded successfully!');
}

async function main() {
    try {
        await seedPlataformasPublicidad();
    } catch (error) {
        console.error('❌ Error seeding plataformas de publicidad:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
