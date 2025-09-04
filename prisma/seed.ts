import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed data...");

    // Crear planes
    console.log("📋 Creando planes...");
    await prisma.plan.upsert({
        where: { slug: "starter" },
        update: {},
        create: {
            name: "Starter",
            slug: "starter",
            active_project_limit: 5,
            price_monthly: 29,
            price_yearly: 290,
            features: {
                analytics: false,
                custom_domain: false,
                api_access: false,
                priority_support: false,
            },
        },
    });

    const professionalPlan = await prisma.plan.upsert({
        where: { slug: "professional" },
        update: {},
        create: {
            name: "Professional",
            slug: "professional",
            active_project_limit: 15,
            price_monthly: 79,
            price_yearly: 790,
            features: {
                analytics: true,
                custom_domain: false,
                api_access: false,
                priority_support: true,
            },
        },
    });

    await prisma.plan.upsert({
        where: { slug: "enterprise" },
        update: {},
        create: {
            name: "Enterprise",
            slug: "enterprise",
            active_project_limit: 50,
            price_monthly: 199,
            price_yearly: 1990,
            features: {
                analytics: true,
                custom_domain: true,
                api_access: true,
                priority_support: true,
            },
        },
    });

    // Crear ProSocial Events como primer tenant
    console.log("🏢 Creando ProSocial Events studio...");
    const prosocialEvents = await prisma.studio.upsert({
        where: { slug: "prosocial-events" },
        update: {},
        create: {
            slug: "prosocial-events",
            name: "ProSocial Events",
            email: "admin@prosocial.mx",
            phone: "+52 999 123 4567",
            plan_id: professionalPlan.id,
            subscription_status: "ACTIVE",
            trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            active_projects_count: 3,
            brand_color: "#3b82f6",
            settings: {
                currency: "MXN",
                timezone: "America/Mexico_City",
                language: "es",
            },
        },
    });

    // Crear usuario owner para ProSocial Events
    console.log("👤 Creando usuario admin...");
    const hashedPassword = await bcrypt.hash("ProSocial2025!", 12);

    await prisma.studioUser.upsert({
        where: {
            studio_id_email: {
                studio_id: prosocialEvents.id,
                email: "admin@prosocial.mx",
            },
        },
        update: {},
        create: {
            studio_id: prosocialEvents.id,
            email: "admin@prosocial.mx",
            name: "Admin ProSocial",
            role: "OWNER",
            password_hash: hashedPassword,
            email_verified: true,
        },
    });

    // Crear algunos clientes de ejemplo
    console.log("👥 Creando clientes de ejemplo...");
    const cliente1 = await prisma.client.create({
        data: {
            studio_id: prosocialEvents.id,
            name: "María González",
            email: "maria@example.com",
            phone: "+52 999 111 2222",
            address: "Calle 60 #123, Mérida, Yucatán",
            notes: "Cliente VIP - bodas de lujo",
            tags: ["VIP", "Bodas"],
        },
    });

    const cliente2 = await prisma.client.create({
        data: {
            studio_id: prosocialEvents.id,
            name: "Carlos Pérez",
            email: "carlos@example.com",
            phone: "+52 999 333 4444",
            address: "Av. Reforma #456, Mérida, Yucatán",
            notes: "XV Años y eventos sociales",
            tags: ["XV Años", "Eventos Sociales"],
        },
    });

    // Crear algunos proyectos de ejemplo
    console.log("🎪 Creando proyectos de ejemplo...");
    const proyecto1 = await prisma.project.create({
        data: {
            studio_id: prosocialEvents.id,
            name: "Boda María & Juan",
            client_id: cliente1.id,
            event_date: new Date("2025-12-15"),
            status: "ACTIVE",
            total_value: 35000,
            prosocial_commission: 10500, // 30%
            studio_earnings: 24500, // 70%
            event_type: "Boda",
            location: "Hotel Casa Azul, Mérida",
            description: "Boda de lujo con 200 invitados",
        },
    });

    const proyecto2 = await prisma.project.create({
        data: {
            studio_id: prosocialEvents.id,
            name: "XV Años Sofía",
            client_id: cliente2.id,
            event_date: new Date("2025-10-20"),
            status: "ACTIVE",
            total_value: 18000,
            prosocial_commission: 5400, // 30%
            studio_earnings: 12600, // 70%
            event_type: "XV Años",
            location: "Salón de Eventos Luna, Mérida",
            description: "Celebración de XV años con temática vintage",
        },
    });

    // Crear cotizaciones de ejemplo
    console.log("💰 Creando cotizaciones de ejemplo...");
    await prisma.quotation.create({
        data: {
            project_id: proyecto1.id,
            name: "Cotización Boda Completa",
            total: 35000,
            discount: 0,
            status: "APPROVED",
            approved_at: new Date(),
            description: "Paquete completo de fotografía y video para boda",
            items: [
                {
                    id: 1,
                    name: "Fotografía de boda (8 horas)",
                    quantity: 1,
                    price: 15000,
                    description: "Cobertura completa del evento con 2 fotógrafos",
                },
                {
                    id: 2,
                    name: "Video de boda (8 horas)",
                    quantity: 1,
                    price: 12000,
                    description: "Video profesional con drone y cámara estabilizada",
                },
                {
                    id: 3,
                    name: "Álbum de fotos premium",
                    quantity: 1,
                    price: 5000,
                    description: "Álbum de lujo con 50 páginas",
                },
                {
                    id: 4,
                    name: "Entrega digital",
                    quantity: 1,
                    price: 3000,
                    description: "Galería online y USB con todas las fotos",
                },
            ],
        },
    });

    await prisma.quotation.create({
        data: {
            project_id: proyecto2.id,
            name: "Cotización XV Años",
            total: 18000,
            discount: 2000,
            status: "APPROVED",
            approved_at: new Date(),
            description: "Paquete fotografía y video para XV años",
            items: [
                {
                    id: 1,
                    name: "Fotografía XV años (6 horas)",
                    quantity: 1,
                    price: 10000,
                    description: "Cobertura completa con sesión previa",
                },
                {
                    id: 2,
                    name: "Video highlights",
                    quantity: 1,
                    price: 8000,
                    description: "Video resumen de 5 minutos",
                },
                {
                    id: 3,
                    name: "Sesión de fotos previa",
                    quantity: 1,
                    price: 2000,
                    description: "Sesión en locación especial",
                },
            ],
        },
    });

    // Crear transacciones de revenue
    console.log("💸 Creando transacciones de revenue...");
    await prisma.revenueTransaction.create({
        data: {
            studio_id: prosocialEvents.id,
            project_id: proyecto1.id,
            type: "PROJECT",
            amount: 35000,
            prosocial_fee: 10500,
            studio_amount: 24500,
            description: "Revenue share - Boda María & Juan",
        },
    });

    await prisma.revenueTransaction.create({
        data: {
            studio_id: prosocialEvents.id,
            project_id: proyecto2.id,
            type: "PROJECT",
            amount: 18000,
            prosocial_fee: 5400,
            studio_amount: 12600,
            description: "Revenue share - XV Años Sofía",
        },
    });

    console.log("✅ Seed data creado exitosamente!");
    console.log("🏢 Studio: prosocial-events");
    console.log("👤 User: admin@prosocial.mx / ProSocial2025!");
    console.log("🌐 URL: http://localhost:3000/prosocial-events/");
    console.log("📊 Clientes: 2");
    console.log("🎪 Proyectos: 2");
    console.log("💰 Revenue total: $53,000 MXN");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
