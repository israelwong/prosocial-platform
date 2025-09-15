const { PrismaClient } = require('@prisma/client');

async function checkUserProfile() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Verificando perfiles de usuario...');
        
        // Verificar todos los perfiles de usuario
        const userProfiles = await prisma.user_profiles.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
        
        console.log('📊 Perfiles de usuario encontrados:');
        userProfiles.forEach(profile => {
            console.log(`  • ${profile.email} (${profile.id})`);
            console.log(`    - Nombre: ${profile.fullName || 'Sin nombre'}`);
            console.log(`    - Rol: ${profile.role}`);
            console.log(`    - Activo: ${profile.isActive}`);
            console.log(`    - Creado: ${profile.createdAt}`);
            console.log('');
        });
        
        // Verificar si hay usuarios con rol de agente
        const agents = userProfiles.filter(profile => profile.role === 'agente');
        console.log(`📊 Usuarios con rol de agente: ${agents.length}`);
        
        if (agents.length === 0) {
            console.log('⚠️ No se encontraron usuarios con rol de agente');
            console.log('🔧 Creando perfil de usuario para el agente...');
            
            // Buscar el agente en la tabla prosocial_agents
            const prosocialAgents = await prisma.prosocial_agents.findMany({
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    activo: true
                }
            });
            
            console.log('📊 Agentes en prosocial_agents:');
            prosocialAgents.forEach(agent => {
                console.log(`  • ${agent.nombre} (${agent.email}) - ID: ${agent.id}`);
            });
            
            // Crear perfiles de usuario para los agentes que no tienen
            for (const agent of prosocialAgents) {
                const existingProfile = userProfiles.find(profile => profile.email === agent.email);
                if (!existingProfile) {
                    console.log(`🔧 Creando perfil para ${agent.email}...`);
                    try {
                        await prisma.user_profiles.create({
                            data: {
                                id: agent.id, // Usar el mismo ID del agente
                                email: agent.email,
                                fullName: agent.nombre,
                                role: 'agente',
                                isActive: agent.activo
                            }
                        });
                        console.log(`✅ Perfil creado para ${agent.email}`);
                    } catch (error) {
                        console.log(`⚠️ Error creando perfil para ${agent.email}: ${error.message}`);
                    }
                } else {
                    console.log(`ℹ️ Perfil ya existe para ${agent.email}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUserProfile();
