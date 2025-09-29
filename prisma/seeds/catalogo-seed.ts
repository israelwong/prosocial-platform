import { PrismaClient } from '@prisma/client';
import catalogoData from '../../docs/05-legacy/estructura_catalogo_procesada.json';

const prisma = new PrismaClient();

async function seedCatalogo() {
    console.log('🌱 Iniciando seed del catálogo...\n');

    try {
        // 1. Buscar el proyecto "demo-studio"
        const demoStudio = await prisma.projects.findUnique({
            where: { slug: 'demo-studio' },
        });

        if (!demoStudio) {
            console.error('❌ Error: No se encontró el proyecto "demo-studio"');
            console.log('💡 Tip: Asegúrate de tener el proyecto creado primero');
            return;
        }

        console.log(`✅ Proyecto encontrado: ${demoStudio.name} (${demoStudio.slug})\n`);

        // 2. Obtener configuración del estudio para calcular precios
        const config = await prisma.project_configuraciones.findFirst({
            where: {
                projectId: demoStudio.id,
                status: 'active',
            },
            orderBy: {
                updatedAt: 'desc',
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
        console.log(`   - Comisión Venta: ${config.comision_venta}%\n`);

        // 3. Calcular utilidad y precio público correctamente
        function calcularPrecioPublico(
            costo: number,
            tipoUtilidad: 'servicio' | 'producto'
        ): { gasto: number; utilidad: number; precio_publico: number } {
            const utilidadPorcentaje =
                tipoUtilidad === 'servicio'
                    ? config.utilidad_servicio
                    : config.utilidad_producto;

            const subtotal = costo / (1 - utilidadPorcentaje / 100);
            const utilidad = subtotal - costo;
            const conSobreprecio = subtotal * (1 + config.sobreprecio / 100);
            const precio_publico = conSobreprecio * (1 + config.comision_venta / 100);

            // Gasto por defecto en 0 (se puede calcular después)
            const gasto = 0;

            return {
                gasto,
                utilidad: Number(utilidad.toFixed(2)),
                precio_publico: Number(precio_publico.toFixed(2)),
            };
        }

        // 4. Iterar sobre las secciones del JSON
        let totalSecciones = 0;
        let totalCategorias = 0;
        let totalServicios = 0;

        for (const [indexSeccion, seccionData] of catalogoData.catalogo.entries()) {
            console.log(`📂 Creando sección: "${seccionData.seccion}"...`);

            // Crear sección
            const seccion = await prisma.project_servicio_secciones.create({
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
                const categoria = await prisma.project_servicio_categorias.create({
                    data: {
                        nombre: categoriaData.categoria,
                        orden: indexCategoria,
                    },
                });

                // Crear relación sección-categoría
                await prisma.project_seccion_categorias.create({
                    data: {
                        seccionId: seccion.id,
                        categoriaId: categoria.id,
                    },
                });

                totalCategorias++;

                // Iterar sobre servicios
                for (const [indexServicio, servicioData] of categoriaData.servicios.entries()) {
                    const precios = calcularPrecioPublico(
                        servicioData.costo,
                        servicioData.tipo_utilidad as 'servicio' | 'producto'
                    );

                    // Crear servicio
                    await prisma.project_servicios.create({
                        data: {
                            studioId: demoStudio.id,
                            servicioCategoriaId: categoria.id,
                            nombre: servicioData.nombre,
                            costo: servicioData.costo,
                            gasto: precios.gasto,
                            utilidad: precios.utilidad,
                            precio_publico: precios.precio_publico,
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
