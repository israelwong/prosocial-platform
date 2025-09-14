const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
    try {
        console.log('🚀 Iniciando migración del sistema de campañas...');

        // Crear la tabla ProSocialCampaña
        console.log('📋 Creando tabla prosocial_campanas...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "prosocial_campanas" (
                "id" TEXT NOT NULL,
                "nombre" TEXT NOT NULL,
                "descripcion" TEXT,
                "presupuestoTotal" DECIMAL(10,2) NOT NULL,
                "fechaInicio" TIMESTAMP(3) NOT NULL,
                "fechaFin" TIMESTAMP(3) NOT NULL,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "status" TEXT NOT NULL DEFAULT 'planificada',
                "leadsGenerados" INTEGER NOT NULL DEFAULT 0,
                "leadsSuscritos" INTEGER NOT NULL DEFAULT 0,
                "gastoReal" DECIMAL(10,2) NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "prosocial_campanas_pkey" PRIMARY KEY ("id")
            );
        `);

        // Crear la tabla ProSocialPlataformaPublicidad
        console.log('📋 Creando tabla prosocial_plataformas_publicidad...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "prosocial_plataformas_publicidad" (
                "id" TEXT NOT NULL,
                "nombre" TEXT NOT NULL,
                "descripcion" TEXT,
                "tipo" TEXT NOT NULL,
                "color" TEXT,
                "icono" TEXT,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "orden" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "prosocial_plataformas_publicidad_pkey" PRIMARY KEY ("id")
            );
        `);

        // Crear la tabla ProSocialCampañaPlataforma
        console.log('📋 Creando tabla prosocial_campana_plataformas...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "prosocial_campana_plataformas" (
                "id" TEXT NOT NULL,
                "campañaId" TEXT NOT NULL,
                "plataformaId" TEXT NOT NULL,
                "presupuesto" DECIMAL(10,2) NOT NULL,
                "gastoReal" DECIMAL(10,2) NOT NULL DEFAULT 0,
                "leads" INTEGER NOT NULL DEFAULT 0,
                "conversiones" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "prosocial_campana_plataformas_pkey" PRIMARY KEY ("id")
            );
        `);

        // Crear índices para prosocial_campanas
        console.log('📋 Creando índices para campañas...');
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_campanas_fechaInicio_fechaFin_idx" ON "prosocial_campanas"("fechaInicio", "fechaFin");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_campanas_status_idx" ON "prosocial_campanas"("status");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_campanas_isActive_idx" ON "prosocial_campanas"("isActive");`);

        // Crear índices para prosocial_plataformas_publicidad
        console.log('📋 Creando índices para plataformas...');
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "prosocial_plataformas_publicidad_nombre_key" ON "prosocial_plataformas_publicidad"("nombre");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_plataformas_publicidad_tipo_idx" ON "prosocial_plataformas_publicidad"("tipo");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_plataformas_publicidad_isActive_idx" ON "prosocial_plataformas_publicidad"("isActive");`);

        // Crear índices para prosocial_campana_plataformas
        console.log('📋 Creando índices para campaña-plataformas...');
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "prosocial_campana_plataformas_campañaId_plataformaId_key" ON "prosocial_campana_plataformas"("campañaId", "plataformaId");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_campana_plataformas_campañaId_idx" ON "prosocial_campana_plataformas"("campañaId");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_campana_plataformas_plataformaId_idx" ON "prosocial_campana_plataformas"("plataformaId");`);

        // Agregar columna campañaId a la tabla prosocial_leads
        console.log('📋 Agregando columna campañaId a prosocial_leads...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_leads" ADD COLUMN "campañaId" TEXT;`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_leads_campañaId_idx" ON "prosocial_leads"("campañaId");`);

        // Agregar foreign keys
        console.log('📋 Agregando foreign keys...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_campana_plataformas" ADD CONSTRAINT "prosocial_campana_plataformas_campañaId_fkey" FOREIGN KEY ("campañaId") REFERENCES "prosocial_campanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_campana_plataformas" ADD CONSTRAINT "prosocial_campana_plataformas_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "prosocial_plataformas_publicidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_leads" ADD CONSTRAINT "prosocial_leads_campañaId_fkey" FOREIGN KEY ("campañaId") REFERENCES "prosocial_campanas"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);

        console.log('✅ Tablas creadas exitosamente');

        // Verificar que todo funcionó
        const campanasCount = await prisma.proSocialCampaña.count();
        console.log(`📈 Total de campañas: ${campanasCount}`);

        const plataformasCount = await prisma.proSocialPlataformaPublicidad.count();
        console.log(`📈 Total de plataformas: ${plataformasCount}`);

        const leadsCount = await prisma.proSocialLead.count();
        console.log(`👥 Total de leads: ${leadsCount}`);

        console.log('🎉 Migración completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la migración
runMigration()
    .then(() => {
        console.log('✅ Migración finalizada');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
