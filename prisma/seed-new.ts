import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Crear planes
    const planStarter = await prisma.plan.upsert({
        where: { slug: 'starter' },
        update: {},
        create: {
            name: 'Starter',
            slug: 'starter',
            activeProjectLimit: 5,
            priceMonthly: 29,
            priceYearly: 290,
            features: JSON.stringify([
                '5 proyectos activos',
                'Gestión de clientes',
                'Cotizaciones básicas',
                'Soporte por email'
            ]),
            stripePriceId: 'price_starter_test'
        }
    })

    const planProfessional = await prisma.plan.upsert({
        where: { slug: 'professional' },
        update: {},
        create: {
            name: 'Professional',
            slug: 'professional',
            activeProjectLimit: 25,
            priceMonthly: 79,
            priceYearly: 790,
            features: JSON.stringify([
                '25 proyectos activos',
                'Gestión avanzada de clientes',
                'Cotizaciones y facturación',
                'Reportes y analytics',
                'Soporte prioritario'
            ]),
            stripePriceId: 'price_professional_test'
        }
    })

    // Crear studio de ejemplo
    const studio = await prisma.studio.upsert({
        where: { slug: 'estudio-demo' },
        update: {},
        create: {
            name: 'Estudio Demo',
            slug: 'estudio-demo',
            email: 'demo@estudio.com',
            phone: '+52 55 1234 5678',
            address: 'Ciudad de México, México',
            planId: planStarter.id,
            subscriptionStatus: 'active',
            subscriptionStart: new Date(),
            commissionRate: 0.30
        }
    })

    // Crear usuario del studio
    const studioUser = await prisma.studioUser.upsert({
        where: { email: 'admin@estudio.com' },
        update: {},
        create: {
            email: 'admin@estudio.com',
            username: 'admin',
            password: '$2a$10$hash_ejemplo', // En producción usar bcrypt real
            role: 'owner',
            status: 'active',
            telefono: '+52 55 1234 5678', // Teléfono obligatorio
            studioId: studio.id
        }
    })    // Crear tipos de evento
    const eventoTipoBoda = await prisma.eventoTipo.upsert({
        where: { id: 'evento_tipo_boda' },
        update: {},
        create: {
            id: 'evento_tipo_boda',
            nombre: 'Boda',
            posicion: 1
        }
    })

    const eventoTipoXV = await prisma.eventoTipo.upsert({
        where: { id: 'evento_tipo_xv' },
        update: {},
        create: {
            id: 'evento_tipo_xv',
            nombre: 'XV Años',
            posicion: 2
        }
    })

    // Crear canales
    const canalFacebook = await prisma.canal.upsert({
        where: { id: 'canal_facebook' },
        update: {},
        create: {
            id: 'canal_facebook',
            nombre: 'Facebook',
            posicion: 1
        }
    })

    // Crear clientes de ejemplo
    const cliente1 = await prisma.cliente.upsert({
        where: { id: 'cliente_maria' },
        update: {},
        create: {
            id: 'cliente_maria',
            nombre: 'María García',
            email: 'maria@email.com',
            telefono: '+52 55 9999 0001',
            direccion: 'Polanco, CDMX',
            status: 'activo',
            studioId: studio.id,
            canalId: canalFacebook.id
        }
    })

    const cliente2 = await prisma.cliente.upsert({
        where: { id: 'cliente_juan' },
        update: {},
        create: {
            id: 'cliente_juan',
            nombre: 'Juan Pérez',
            email: 'juan@email.com',
            telefono: '+52 55 9999 0002',
            direccion: 'Roma Norte, CDMX',
            status: 'prospecto',
            studioId: studio.id
        }
    })

    // Crear eventos de ejemplo
    const evento1 = await prisma.evento.upsert({
        where: { id: 'evento_demo_1' },
        update: {},
        create: {
            id: 'evento_demo_1',
            nombre: 'Boda María & Carlos',
            fecha_evento: new Date('2025-06-15'),
            sede: 'Hacienda San Miguel',
            direccion: 'Tlalpan, CDMX',
            studioId: studio.id,
            clienteId: cliente1.id,
            eventoTipoId: eventoTipoBoda.id,
            userId: studioUser.id
        }
    })

    await prisma.evento.upsert({
        where: { id: 'evento_demo_2' },
        update: {},
        create: {
            id: 'evento_demo_2',
            nombre: 'XV Años Sofía',
            fecha_evento: new Date('2025-08-20'),
            sede: 'Salón Crystal',
            direccion: 'Coyoacán, CDMX',
            studioId: studio.id,
            clienteId: cliente2.id,
            eventoTipoId: eventoTipoXV.id,
            userId: studioUser.id
        }
    })

    // Crear categorías de servicio
    const categoriaFotografia = await prisma.servicioCategoria.upsert({
        where: { id: 'categoria_fotografia' },
        update: {},
        create: {
            id: 'categoria_fotografia',
            nombre: 'Fotografía',
            posicion: 1
        }
    })

    await prisma.servicioCategoria.upsert({
        where: { id: 'categoria_video' },
        update: {},
        create: {
            id: 'categoria_video',
            nombre: 'Video',
            posicion: 2
        }
    })

    // Crear servicios de ejemplo
    await prisma.servicio.upsert({
        where: { id: 'servicio_foto_boda' },
        update: {},
        create: {
            id: 'servicio_foto_boda',
            nombre: 'Fotografía de Boda',
            costo: 3000,
            gasto: 500,
            utilidad: 1500,
            precio_publico: 5000,
            tipo_utilidad: 'servicio',
            studioId: studio.id,
            servicioCategoriaId: categoriaFotografia.id
        }
    })

    // Crear cotizaciones de ejemplo
    await prisma.cotizacion.upsert({
        where: { id: 'cotizacion_demo_1' },
        update: {},
        create: {
            id: 'cotizacion_demo_1',
            nombre: 'Cotización Boda María & Carlos',
            precio: 15000,
            descripcion: 'Paquete completo de fotografía y video',
            studioId: studio.id,
            eventoTipoId: eventoTipoBoda.id,
            eventoId: evento1.id,
            status: 'pendiente'
        }
    })

    console.log('✅ Database seeded successfully!')
    console.log('📊 Created:')
    console.log(`  - ${2} Plans`)
    console.log(`  - ${1} Studio: ${studio.name}`)
    console.log(`  - ${1} Studio User: ${studioUser.email}`)
    console.log(`  - ${2} Clients`)
    console.log(`  - ${2} Events`)
    console.log(`  - ${1} Quotation`)
    console.log(`  - ${2} Services`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
