import { PrismaClient } from '@prisma/client'

// Cliente de Prisma centralizado
const prisma = new PrismaClient({
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

export { prisma };
