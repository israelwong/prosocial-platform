import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCanalesAdquisicion() {
    console.log('🌱 Seeding canales de adquisición...');

    const canales = [
        // REDES SOCIALES
        {
            nombre: 'Facebook',
            descripcion: 'Leads obtenidos a través de Facebook',
            categoria: 'Redes Sociales',
            color: '#1877F2',
            icono: 'Facebook',
            orden: 1
        },
        {
            nombre: 'Instagram',
            descripcion: 'Leads obtenidos a través de Instagram',
            categoria: 'Redes Sociales',
            color: '#E4405F',
            icono: 'Instagram',
            orden: 2
        },
        {
            nombre: 'TikTok',
            descripcion: 'Leads obtenidos a través de TikTok',
            categoria: 'Redes Sociales',
            color: '#000000',
            icono: 'Music',
            orden: 3
        },
        {
            nombre: 'LinkedIn',
            descripcion: 'Leads obtenidos a través de LinkedIn',
            categoria: 'Redes Sociales',
            color: '#0A66C2',
            icono: 'Linkedin',
            orden: 4
        },
        {
            nombre: 'Twitter/X',
            descripcion: 'Leads obtenidos a través de Twitter/X',
            categoria: 'Redes Sociales',
            color: '#1DA1F2',
            icono: 'Twitter',
            orden: 5
        },

        // PAGO
        {
            nombre: 'Facebook Ads',
            descripcion: 'Leads obtenidos a través de Facebook Ads',
            categoria: 'Pago',
            color: '#1877F2',
            icono: 'Target',
            orden: 6
        },
        {
            nombre: 'Instagram Ads',
            descripcion: 'Leads obtenidos a través de Instagram Ads',
            categoria: 'Pago',
            color: '#E4405F',
            icono: 'Target',
            orden: 7
        },
        {
            nombre: 'TikTok Ads',
            descripcion: 'Leads obtenidos a través de TikTok Ads',
            categoria: 'Pago',
            color: '#000000',
            icono: 'Target',
            orden: 8
        },
        {
            nombre: 'Google Ads',
            descripcion: 'Leads obtenidos a través de Google Ads',
            categoria: 'Pago',
            color: '#4285F4',
            icono: 'Search',
            orden: 9
        },
        {
            nombre: 'YouTube Ads',
            descripcion: 'Leads obtenidos a través de YouTube Ads',
            categoria: 'Pago',
            color: '#FF0000',
            icono: 'Play',
            orden: 10
        },

        // ORGÁNICO
        {
            nombre: 'Landing Page',
            descripcion: 'Leads obtenidos a través de landing pages',
            categoria: 'Orgánico',
            color: '#10B981',
            icono: 'Globe',
            orden: 11
        },
        {
            nombre: 'Google Search',
            descripcion: 'Leads obtenidos a través de búsquedas en Google',
            categoria: 'Orgánico',
            color: '#4285F4',
            icono: 'Search',
            orden: 12
        },
        {
            nombre: 'Directo',
            descripcion: 'Leads que contactaron directamente',
            categoria: 'Orgánico',
            color: '#6B7280',
            icono: 'ArrowRight',
            orden: 13
        },
        {
            nombre: 'Email Marketing',
            descripcion: 'Leads obtenidos a través de campañas de email',
            categoria: 'Orgánico',
            color: '#8B5CF6',
            icono: 'Mail',
            orden: 14
        },

        // REFERIDOS
        {
            nombre: 'Referido Cliente',
            descripcion: 'Leads referidos por clientes existentes',
            categoria: 'Referidos',
            color: '#F59E0B',
            icono: 'Users',
            orden: 15
        },
        {
            nombre: 'Referido Agente',
            descripcion: 'Leads referidos por agentes',
            categoria: 'Referidos',
            color: '#F59E0B',
            icono: 'UserCheck',
            orden: 16
        },
        {
            nombre: 'Referido Partner',
            descripcion: 'Leads referidos por partners comerciales',
            categoria: 'Referidos',
            color: '#F59E0B',
            icono: 'Handshake',
            orden: 17
        },

        // OTROS
        {
            nombre: 'WhatsApp',
            descripcion: 'Leads obtenidos a través de WhatsApp',
            categoria: 'Otros',
            color: '#25D366',
            icono: 'MessageCircle',
            orden: 18
        },
        {
            nombre: 'Evento',
            descripcion: 'Leads obtenidos en eventos presenciales o virtuales',
            categoria: 'Otros',
            color: '#EF4444',
            icono: 'Calendar',
            orden: 19
        },
        {
            nombre: 'Podcast',
            descripcion: 'Leads obtenidos a través de podcasts',
            categoria: 'Otros',
            color: '#8B5CF6',
            icono: 'Headphones',
            orden: 20
        },
        {
            nombre: 'Webinar',
            descripcion: 'Leads obtenidos a través de webinars',
            categoria: 'Otros',
            color: '#3B82F6',
            icono: 'Video',
            orden: 21
        }
    ];

    for (const canalData of canales) {
        const canal = await prisma.proSocialCanalAdquisicion.upsert({
            where: { nombre: canalData.nombre },
            update: canalData,
            create: canalData,
        });
        console.log(`✅ Canal creado/actualizado: ${canal.nombre} (${canal.categoria})`);
    }

    console.log('🎉 Canales de adquisición seeded successfully!');
}

async function main() {
    try {
        await seedCanalesAdquisicion();
    } catch (error) {
        console.error('❌ Error seeding canales de adquisición:', error);
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
