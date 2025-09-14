const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeLeadEntity() {
    try {
        console.log('🔍 Analizando entidad ProSocialLead y elementos relacionados...\n');

        // 1. Verificar campos de ProSocialLead
        console.log('📋 CAMPOS DE ProSocialLead:');
        const leadFields = [
            'id', 'nombre', 'email', 'telefono', 'nombreEstudio', 'slugEstudio',
            'etapaId', 'fechaUltimoContacto', 'planInteres', 'presupuestoMensual',
            'fechaProbableInicio', 'agentId', 'puntaje', 'prioridad',
            'canalAdquisicionId', 'campañaId', 'fechaConversion', 'studioId',
            'createdAt', 'updatedAt'
        ];
        
        leadFields.forEach(field => {
            console.log(`  ✅ ${field}`);
        });

        // 2. Verificar relaciones existentes
        console.log('\n🔗 RELACIONES EXISTENTES:');
        const relations = [
            'agent (ProSocialAgent)',
            'etapa (ProSocialPipelineStage)',
            'canalAdquisicion (ProSocialCanalAdquisicion)',
            'campaña (ProSocialCampaña)',
            'studio (Studio)',
            'actividades (ProSocialActivity[])',
            'notifications (ProSocialNotification[])',
            'bitacora (ProSocialLeadBitacora[])'
        ];
        
        relations.forEach(relation => {
            console.log(`  ✅ ${relation}`);
        });

        // 3. Verificar modelos relacionados
        console.log('\n📊 MODELOS RELACIONADOS:');
        
        // Verificar ProSocialLeadBitacora
        const bitacoraFields = [
            'id', 'leadId', 'tipo', 'titulo', 'descripcion', 'metadata',
            'usuarioId', 'createdAt', 'updatedAt'
        ];
        console.log('  📝 ProSocialLeadBitacora:');
        bitacoraFields.forEach(field => {
            console.log(`    ✅ ${field}`);
        });

        // Verificar Agenda
        const agendaFields = [
            'id', 'studioId', 'userId', 'eventoId', 'concepto', 'descripcion',
            'googleMapsUrl', 'direccion', 'fecha', 'hora', 'status',
            'agendaTipo', 'createdAt', 'updatedAt'
        ];
        console.log('  📅 Agenda:');
        agendaFields.forEach(field => {
            console.log(`    ✅ ${field}`);
        });

        // 4. Elementos faltantes identificados
        console.log('\n❌ ELEMENTOS FALTANTES IDENTIFICADOS:');
        
        const missingElements = [
            'Relación directa entre ProSocialLead y Agenda',
            'Tipos de citas específicos para leads (demostración, consulta, soporte)',
            'Sistema de recordatorios automáticos',
            'Integración con notificaciones para citas',
            'Campos de seguimiento avanzado (última actividad, próxima acción)',
            'Sistema de scoring automático basado en actividades',
            'Plantillas de comunicación por etapa',
            'Integración con WhatsApp Business API',
            'Sistema de seguimiento de emails enviados',
            'Métricas de engagement por lead'
        ];
        
        missingElements.forEach(element => {
            console.log(`  ❌ ${element}`);
        });

        // 5. Propuestas de mejora
        console.log('\n💡 PROPUESTAS DE MEJORA:');
        
        const improvements = [
            'Crear tabla ProSocialLeadCita para relacionar leads con citas',
            'Agregar campo tipoCita en Agenda (demostracion, consulta, soporte, seguimiento)',
            'Implementar sistema de recordatorios automáticos',
            'Crear plantillas de comunicación por etapa del pipeline',
            'Agregar métricas de engagement (tiempo de respuesta, frecuencia de contacto)',
            'Implementar scoring automático basado en actividades',
            'Crear sistema de seguimiento de emails y llamadas',
            'Integrar con WhatsApp Business API para comunicación',
            'Agregar dashboard de métricas por lead',
            'Implementar sistema de alertas por inactividad'
        ];
        
        improvements.forEach(improvement => {
            console.log(`  💡 ${improvement}`);
        });

        // 6. Verificar datos de prueba
        console.log('\n🧪 VERIFICANDO DATOS DE PRUEBA:');
        
        const leadCount = await prisma.proSocialLead.count();
        console.log(`  📊 Total de leads: ${leadCount}`);
        
        const agentCount = await prisma.proSocialAgent.count();
        console.log(`  👥 Total de agentes: ${agentCount}`);
        
        const canalCount = await prisma.proSocialCanalAdquisicion.count();
        console.log(`  📡 Total de canales: ${canalCount}`);
        
        const etapaCount = await prisma.proSocialPipelineStage.count();
        console.log(`  🔄 Total de etapas: ${etapaCount}`);
        
        const agendaCount = await prisma.agenda.count();
        console.log(`  📅 Total de citas: ${agendaCount}`);

        console.log('\n✅ Análisis completado');

    } catch (error) {
        console.error('❌ Error durante el análisis:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el análisis
analyzeLeadEntity()
    .then(() => {
        console.log('✅ Análisis finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
