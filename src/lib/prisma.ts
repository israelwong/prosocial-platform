import { PrismaClient } from '@prisma/client'

// Patrón Singleton para evitar múltiples instancias en desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  // Configuración optimizada para producción
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
  // Configuración de conexión optimizada
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Reutilización en desarrollo para evitar agotamiento de conexiones
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
