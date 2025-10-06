/**
 * Script para crear logs de sesión de prueba
 * Ejecutar con: node scripts/seed-session-logs.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

const sampleLogs = [
    {
        action: 'login',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: true,
        details: { browser: 'Chrome', os: 'Windows 10' }
    },
    {
        action: 'session_created',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: true,
        details: { session_id: 'sess_123456' }
    },
    {
        action: 'password_change',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: true,
        details: { password_strength: 'strong' }
    },
    {
        action: 'login',
        ip_address: '10.0.0.50',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        success: true,
        details: { browser: 'Safari', os: 'iOS 17', device: 'iPhone' }
    },
    {
        action: 'login',
        ip_address: '172.16.0.25',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: true,
        details: { browser: 'Chrome', os: 'macOS' }
    },
    {
        action: 'logout',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: true,
        details: { session_duration: '2h 30m' }
    },
    {
        action: 'login',
        ip_address: '203.0.113.45',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        success: false,
        details: { reason: 'Invalid credentials' }
    }
];

async function seedSessionLogs() {
    console.log('🌱 Creando logs de sesión de prueba...\n');

    try {
        // Buscar el usuario owner@demo-studio.com
        const user = await prisma.users.findUnique({
            where: { email: 'owner@demo-studio.com' }
        });

        if (!user) {
            console.error('❌ Usuario owner@demo-studio.com no encontrado');
            return;
        }

        console.log(`✅ Usuario encontrado: ${user.email} (ID: ${user.id})`);

        // Crear logs de sesión
        for (let i = 0; i < sampleLogs.length; i++) {
            const logData = sampleLogs[i];
            const createdAt = new Date(Date.now() - (i * 2 * 60 * 60 * 1000)); // 2 horas entre cada log

            await prisma.user_access_logs.create({
                data: {
                    user_id: user.id,
                    action: logData.action,
                    ip_address: logData.ip_address,
                    user_agent: logData.user_agent,
                    success: logData.success,
                    details: logData.details,
                    created_at: createdAt
                }
            });

            console.log(`  ✅ Log creado: ${logData.action} (${logData.success ? 'exitoso' : 'fallido'})`);
        }

        console.log('\n🎯 Logs de sesión creados exitosamente!');
        console.log('📊 Total de logs:', sampleLogs.length);
        console.log('👤 Usuario:', user.email);
        console.log('\n🔗 Ahora puedes ver el historial en:');
        console.log('   /studio/demo-studio/configuracion/cuenta/seguridad');

    } catch (error) {
        console.error('❌ Error al crear logs:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSessionLogs().catch(console.error);
