import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCampanasEjemplo() {
    console.log('🌱 Seeding campañas de ejemplo...');

    // Obtener algunas plataformas para asignar
    const plataformas = await prisma.proSocialPlataformaPublicidad.findMany({
        take: 5
    });

    if (plataformas.length === 0) {
        console.log('❌ No hay plataformas disponibles. Ejecuta primero el seed de plataformas.');
        return;
    }

    const campanasEjemplo = [
        {
            nombre: 'Q1 2024 - Fotografía Profesional',
            descripcion: 'Campaña enfocada en fotógrafos profesionales para el primer trimestre',
            presupuestoTotal: 5000.00,
            fechaInicio: new Date('2024-01-01'),
            fechaFin: new Date('2024-03-31'),
            status: 'finalizada',
            isActive: false,
            leadsGenerados: 200,
            leadsSuscritos: 40,
            gastoReal: 4500.00,
            plataformas: [
                { plataformaId: plataformas[0].id, presupuesto: 2000, gastoReal: 1800, leads: 80, conversiones: 16 },
                { plataformaId: plataformas[1].id, presupuesto: 1500, gastoReal: 1350, leads: 60, conversiones: 12 },
                { plataformaId: plataformas[2].id, presupuesto: 1500, gastoReal: 1350, leads: 60, conversiones: 12 }
            ]
        },
        {
            nombre: 'Q2 2024 - Video Corporativo',
            descripcion: 'Campaña para empresas de video corporativo y marketing',
            presupuestoTotal: 8000.00,
            fechaInicio: new Date('2024-04-01'),
            fechaFin: new Date('2024-06-30'),
            status: 'pausada',
            isActive: false,
            leadsGenerados: 150,
            leadsSuscritos: 25,
            gastoReal: 3200.00,
            plataformas: [
                { plataformaId: plataformas[0].id, presupuesto: 3000, gastoReal: 1200, leads: 50, conversiones: 8 },
                { plataformaId: plataformas[3].id, presupuesto: 2500, gastoReal: 1000, leads: 40, conversiones: 7 },
                { plataformaId: plataformas[4].id, presupuesto: 2500, gastoReal: 1000, leads: 60, conversiones: 10 }
            ]
        },
        {
            nombre: 'Q3 2024 - Redes Sociales',
            descripcion: 'Campaña especializada en marketing de redes sociales',
            presupuestoTotal: 3000.00,
            fechaInicio: new Date('2024-07-01'),
            fechaFin: new Date('2024-09-30'),
            status: 'planificada',
            isActive: false,
            leadsGenerados: 0,
            leadsSuscritos: 0,
            gastoReal: 0,
            plataformas: [
                { plataformaId: plataformas[1].id, presupuesto: 1500, gastoReal: 0, leads: 0, conversiones: 0 },
                { plataformaId: plataformas[2].id, presupuesto: 1500, gastoReal: 0, leads: 0, conversiones: 0 }
            ]
        },
        {
            nombre: 'Q4 2024 - Fotografía de Bodas',
            descripcion: 'Campaña especializada en fotógrafos de bodas y eventos',
            presupuestoTotal: 6000.00,
            fechaInicio: new Date('2024-10-01'),
            fechaFin: new Date('2024-12-31'),
            status: 'activa',
            isActive: true,
            leadsGenerados: 75,
            leadsSuscritos: 15,
            gastoReal: 1800.00,
            plataformas: [
                { plataformaId: plataformas[0].id, presupuesto: 2500, gastoReal: 750, leads: 30, conversiones: 6 },
                { plataformaId: plataformas[1].id, presupuesto: 2000, gastoReal: 600, leads: 25, conversiones: 5 },
                { plataformaId: plataformas[2].id, presupuesto: 1500, gastoReal: 450, leads: 20, conversiones: 4 }
            ]
        },
        {
            nombre: 'Black Friday 2024',
            descripcion: 'Campaña especial para Black Friday con descuentos',
            presupuestoTotal: 10000.00,
            fechaInicio: new Date('2024-11-20'),
            fechaFin: new Date('2024-11-30'),
            status: 'finalizada',
            isActive: false,
            leadsGenerados: 500,
            leadsSuscritos: 100,
            gastoReal: 9500.00,
            plataformas: [
                { plataformaId: plataformas[0].id, presupuesto: 4000, gastoReal: 3800, leads: 200, conversiones: 40 },
                { plataformaId: plataformas[1].id, presupuesto: 3000, gastoReal: 2850, leads: 150, conversiones: 30 },
                { plataformaId: plataformas[2].id, presupuesto: 2000, gastoReal: 1900, leads: 100, conversiones: 20 },
                { plataformaId: plataformas[3].id, presupuesto: 1000, gastoReal: 950, leads: 50, conversiones: 10 }
            ]
        }
    ];

    for (const campañaData of campanasEjemplo) {
        const { plataformas: plataformasData, ...campañaInfo } = campañaData;
        
        const campaña = await prisma.proSocialCampaña.create({
            data: {
                ...campañaInfo,
                plataformas: {
                    create: plataformasData.map(p => ({
                        plataformaId: p.plataformaId,
                        presupuesto: p.presupuesto,
                        gastoReal: p.gastoReal,
                        leads: p.leads,
                        conversiones: p.conversiones
                    }))
                }
            },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });
        
        console.log(`✅ Campaña creada: ${campaña.nombre} (${campaña.status}) - ${campaña.plataformas.length} plataformas`);
    }

    console.log('🎉 Campañas de ejemplo seeded successfully!');
}

async function main() {
    try {
        await seedCampanasEjemplo();
    } catch (error) {
        console.error('❌ Error seeding campañas de ejemplo:', error);
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
