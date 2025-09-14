import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('👤 Creating user profiles in database...');

    // Crear perfiles de usuario (asumiendo que los usuarios ya existen en Supabase Auth)
    const userProfiles = [
        {
            id: 'admin-user-id', // Este ID debe coincidir con el ID del usuario en Supabase Auth
            email: 'admin@prosocial.com',
            fullName: 'Administrador ProSocial',
            role: 'super_admin',
            isActive: true
        },
        {
            id: 'agente-user-id', // Este ID debe coincidir con el ID del usuario en Supabase Auth
            email: 'agente@prosocial.com',
            fullName: 'Agente Comercial',
            role: 'agente',
            isActive: true
        },
        {
            id: 'suscriptor-user-id', // Este ID debe coincidir con el ID del usuario en Supabase Auth
            email: 'suscriptor@prosocial.com',
            fullName: 'Suscriptor Demo',
            role: 'suscriptor',
            isActive: true
        }
    ];

    for (const profileData of userProfiles) {
        try {
            await prisma.userProfile.upsert({
                where: { email: profileData.email },
                update: {},
                create: profileData
            });
            console.log(`✅ Created profile for: ${profileData.email}`);
        } catch (error) {
            console.log(`⚠️  Error creating profile for ${profileData.email}:`, error);
        }
    }

    console.log('🎉 User profiles creation completed!');
}

main()
    .catch((e) => {
        console.error('❌ Profile creation failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
