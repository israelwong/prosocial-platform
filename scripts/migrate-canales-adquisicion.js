const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
    try {
        console.log('🚀 Iniciando migración del sistema de canales de adquisición...');

        // Crear la tabla ProSocialCanalAdquisicion
        console.log('📋 Creando tabla prosocial_canales_adquisicion...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "prosocial_canales_adquisicion" (
                "id" TEXT NOT NULL,
                "nombre" TEXT NOT NULL,
                "descripcion" TEXT,
                "categoria" TEXT NOT NULL,
                "color" TEXT,
                "icono" TEXT,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "isVisible" BOOLEAN NOT NULL DEFAULT true,
                "orden" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "prosocial_canales_adquisicion_pkey" PRIMARY KEY ("id")
            );
        `);

        // Crear índices
        console.log('📋 Creando índices...');
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "prosocial_canales_adquisicion_nombre_key" ON "prosocial_canales_adquisicion"("nombre");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_canales_adquisicion_categoria_idx" ON "prosocial_canales_adquisicion"("categoria");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_canales_adquisicion_isActive_idx" ON "prosocial_canales_adquisicion"("isActive");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_canales_adquisicion_isVisible_idx" ON "prosocial_canales_adquisicion"("isVisible");`);

        // Agregar columna canalAdquisicionId a la tabla prosocial_leads
        console.log('📋 Agregando columna canalAdquisicionId a prosocial_leads...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_leads" ADD COLUMN "canalAdquisicionId" TEXT;`);

        // Crear índice para la nueva columna
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_leads_canalAdquisicionId_idx" ON "prosocial_leads"("canalAdquisicionId");`);

        // Agregar foreign key
        console.log('📋 Agregando foreign key...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_leads" ADD CONSTRAINT "prosocial_leads_canalAdquisicionId_fkey" FOREIGN KEY ("canalAdquisicionId") REFERENCES "prosocial_canales_adquisicion"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);

        console.log('✅ Tablas creadas exitosamente');

        // Verificar que todo funcionó
        const canalesCount = await prisma.proSocialCanalAdquisicion.count();
        console.log(`📈 Total de canales: ${canalesCount}`);

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
