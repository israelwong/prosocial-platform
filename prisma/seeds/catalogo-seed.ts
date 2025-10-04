import { PrismaClient } from '@prisma/client';
import catalogoData from '../../docs/05-legacy/estructura_catalogo_procesada.json';

const prisma = new PrismaClient();

async function seedCatalogo() {
    console.log('🌱 Iniciando seed del catálogo...\n');

    try {
        // 1. Buscar el proyecto "demo-studio"
        const demoStudio = await prisma.studios.findUnique({
            where: { slug: 'demo-studio' },
        });

        if (!demoStudio) {
            console.error('❌ Error: No se encontró el proyecto "demo-studio"');
            console.log('💡 Tip: Asegúrate de tener el proyecto creado primero');
            return;
        }

        console.log(`✅ Proyecto encontrado: ${demoStudio.name} (${demoStudio.slug})\n`);

        // 2. LIMPIAR catálogo existente para el demo-studio
        console.log('🧹 Limpiando catálogo existente...');

        // Eliminar servicios y sus gastos asociados
        await prisma.studio_servicio_gastos.deleteMany({
            where: {
                servicios: {
                    studioId: demoStudio.id,
                },
            },
        });

        await prisma.studio_servicios.deleteMany({
            where: { studioId: demoStudio.id },
        });

        // Eliminar relaciones de categorías con secciones
        await prisma.studio_seccion_categorias.deleteMany({});

        // Eliminar categorías
        await prisma.studio_servicio_categorias.deleteMany({});

        // Eliminar secciones
        await prisma.studio_servicio_secciones.deleteMany({});

        console.log('✅ Catálogo limpiado exitosamente\n');

        // 3. Obtener configuración del estudio para calcular precios
        const config = await prisma.studio_configuraciones.findFirst({
            where: {
                studio_id: demoStudio.id,
                status: 'active',
            },
            orderBy: {
                updated_at: 'desc',
            },
        });

        if (!config) {
            console.error('❌ Error: No se encontró configuración activa para el estudio');
            console.log('💡 Tip: Crea una configuración antes de importar el catálogo');
            return;
        }

        console.log('✅ Configuración encontrada');
        console.log(`   - Utilidad Servicio: ${config.utilidad_servicio}%`);
        console.log(`   - Utilidad Producto: ${config.utilidad_producto}%`);
        console.log(`   - Sobreprecio: ${config.sobreprecio}%`);
        console.log(`   - Comisión Venta: ${config.comision_venta}%`);
        console.log('   ℹ️  NOTA: utilidad y precio_publico se calculan al vuelo (no se almacenan)\n');

        // 4. Iterar sobre las secciones del JSON
        let totalSecciones = 0;
        let totalCategorias = 0;
        let totalServicios = 0;

        for (const [indexSeccion, seccionData] of catalogoData.catalogo.entries()) {
            console.log(`📂 Creando sección: "${seccionData.seccion}"...`);

            // Crear sección
            const seccion = await prisma.studio_servicio_secciones.create({
                data: {
                    nombre: seccionData.seccion,
                    descripcion: seccionData.descripcion,
                    orden: indexSeccion,
                },
            });

            totalSecciones++;

            // Iterar sobre categorías
            for (const [indexCategoria, categoriaData] of seccionData.categorias.entries()) {
                // Saltar categorías sin servicios (vacías)
                if (categoriaData.servicios.length === 0) {
                    console.log(`   ⏭️  Saltando categoría vacía: "${categoriaData.categoria}"`);
                    continue;
                }

                console.log(`   📁 Creando categoría: "${categoriaData.categoria}"...`);

                // Crear categoría
                const categoria = await prisma.studio_servicio_categorias.create({
                    data: {
                        nombre: categoriaData.categoria,
                        orden: indexCategoria,
                    },
                });

                // Crear relación sección-categoría
                await prisma.studio_seccion_categorias.create({
                    data: {
                        seccionId: seccion.id,
                        categoriaId: categoria.id,
                    },
                });

                totalCategorias++;

                // Iterar sobre servicios
                for (const [indexServicio, servicioData] of categoriaData.servicios.entries()) {
                    // Crear servicio (sin utilidad ni precio_publico - se calculan al vuelo)
                    await prisma.studio_servicios.create({
                        data: {
                            studioId: demoStudio.id,
                            servicioCategoriaId: categoria.id,
                            nombre: servicioData.nombre,
                            costo: servicioData.costo,
                            gasto: 0, // Se calculará después con servicio_gastos si es necesario
                            tipo_utilidad: servicioData.tipo_utilidad,
                            orden: indexServicio,
                            status: 'active',
                        },
                    });

                    totalServicios++;
                }

                console.log(`      ✅ ${categoriaData.servicios.length} servicio(s) creado(s)`);
            }

            console.log(`   ✅ Sección completada\n`);
        }

        // 5. Resumen final
        console.log('\n✨ ¡Seed completado exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - Secciones creadas: ${totalSecciones}`);
        console.log(`   - Categorías creadas: ${totalCategorias}`);
        console.log(`   - Servicios creados: ${totalServicios}`);
        console.log(`   - Estudio: ${demoStudio.name} (${demoStudio.slug})\n`);
    } catch (error) {
        console.error('\n❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar seed
seedCatalogo()
    .then(() => {
        console.log('✅ Script finalizado correctamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script falló:', error);
        process.exit(1);
    });
