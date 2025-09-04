import { createClientSupabase } from '../src/lib/supabase'
import { prisma } from '../src/lib/prisma'

async function syncUsersToSupabase() {
    console.log('🔄 Sincronizando usuarios con Supabase Auth...')

    const supabase = createClientSupabase()

    try {
        // Obtener todos los usuarios de la base de datos
        const studioUsers = await prisma.studioUser.findMany({
            include: {
                studio: true
            }
        })

        for (const user of studioUsers) {
            console.log(`Creando usuario en Supabase: ${user.email}`)

            // Crear usuario en Supabase Auth
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: 'admin123', // Contraseña temporal, el usuario podrá cambiarla
                email_confirm: true,
                user_metadata: {
                    username: user.username,
                    studio_id: user.studioId,
                    studio_slug: user.studio.slug,
                    role: user.role
                }
            })

            if (error) {
                console.error(`Error creando usuario ${user.email}:`, error.message)
            } else {
                console.log(`✅ Usuario ${user.email} creado en Supabase con ID: ${data.user.id}`)
            }
        }

        console.log('✅ Sincronización completada')
    } catch (error) {
        console.error('❌ Error durante la sincronización:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    syncUsersToSupabase()
}
