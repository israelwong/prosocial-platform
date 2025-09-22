import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    obtenerContactoStudio,
    obtenerTelefonosStudio,
    crearTelefono,
    actualizarTelefono,
    toggleTelefonoEstado,
    eliminarTelefono,
    actualizarContactoData,
    obtenerEstadisticasContacto,
    validarTelefono
} from '../contacto.actions';

// Mock de Prisma
const mockPrisma = {
    projects: {
        findUnique: vi.fn(),
        update: vi.fn(),
    },
    project_telefonos: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
        $transaction: vi.fn(),
    },
};

// Mock de retryDatabaseOperation
vi.mock('@/lib/actions/utils/database-retry', () => ({
    retryDatabaseOperation: vi.fn((fn) => fn()),
}));

// Mock de revalidatePath
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: mockPrisma,
}));

describe('Contacto Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('obtenerContactoStudio', () => {
        it('debería obtener datos de contacto del studio correctamente', async () => {
            const mockStudio = {
                id: 'studio-1',
                name: 'Test Studio',
                slug: 'test-studio',
                address: 'Test Address',
                website: 'https://test.com',
                telefonos: [
                    {
                        id: 'telefono-1',
                        numero: '+52 55 1234 5678',
                        tipo: 'principal',
                        activo: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            };

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);

            const result = await obtenerContactoStudio('test-studio');

            expect(mockPrisma.projects.findUnique).toHaveBeenCalledWith({
                where: { slug: 'test-studio' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    address: true,
                    website: true,
                    telefonos: {
                        select: {
                            id: true,
                            numero: true,
                            tipo: true,
                            activo: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
            });

            expect(result).toEqual({
                contactoData: {
                    direccion: 'Test Address',
                    website: 'https://test.com',
                },
                telefonos: mockStudio.telefonos,
            });
        });

        it('debería lanzar error si el studio no existe', async () => {
            mockPrisma.projects.findUnique.mockResolvedValue(null);

            await expect(obtenerContactoStudio('studio-inexistente')).rejects.toThrow('Studio no encontrado');
        });
    });

    describe('obtenerTelefonosStudio', () => {
        it('debería obtener teléfonos del studio correctamente', async () => {
            const mockStudio = { id: 'studio-1', name: 'Test Studio' };
            const mockTelefonos = [
                {
                    id: 'telefono-1',
                    projectId: 'studio-1',
                    numero: '+52 55 1234 5678',
                    tipo: 'principal',
                    activo: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
            mockPrisma.project_telefonos.findMany.mockResolvedValue(mockTelefonos);

            const result = await obtenerTelefonosStudio('test-studio');

            expect(mockPrisma.projects.findUnique).toHaveBeenCalledWith({
                where: { slug: 'test-studio' },
                select: { id: true, name: true },
            });

            expect(mockPrisma.project_telefonos.findMany).toHaveBeenCalledWith({
                where: { projectId: 'studio-1' },
                orderBy: { createdAt: "asc" },
            });

            expect(result).toEqual(mockTelefonos);
        });

        it('debería aplicar filtros correctamente', async () => {
            const mockStudio = { id: 'studio-1', name: 'Test Studio' };
            const mockTelefonos = [];

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
            mockPrisma.project_telefonos.findMany.mockResolvedValue(mockTelefonos);

            await obtenerTelefonosStudio('test-studio', { activo: true, tipo: 'principal' });

            expect(mockPrisma.project_telefonos.findMany).toHaveBeenCalledWith({
                where: {
                    projectId: 'studio-1',
                    activo: true,
                    tipo: 'principal',
                },
                orderBy: { createdAt: "asc" },
            });
        });
    });

    describe('crearTelefono', () => {
        it('debería crear teléfono correctamente', async () => {
            const mockStudio = { id: 'studio-1' };
            const mockNuevoTelefono = {
                id: 'telefono-1',
                projectId: 'studio-1',
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
            mockPrisma.project_telefonos.findFirst.mockResolvedValue(null);
            mockPrisma.project_telefonos.create.mockResolvedValue(mockNuevoTelefono);

            const result = await crearTelefono('test-studio', {
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
            });

            expect(mockPrisma.project_telefonos.create).toHaveBeenCalledWith({
                data: {
                    projectId: 'studio-1',
                    numero: '+52 55 1234 5678',
                    tipo: 'principal',
                    activo: true,
                },
            });

            expect(result).toEqual(mockNuevoTelefono);
        });

        it('debería lanzar error si ya existe teléfono del mismo tipo activo', async () => {
            const mockStudio = { id: 'studio-1' };
            const mockTelefonoExistente = {
                id: 'telefono-1',
                projectId: 'studio-1',
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
            };

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
            mockPrisma.project_telefonos.findFirst.mockResolvedValue(mockTelefonoExistente);

            await expect(crearTelefono('test-studio', {
                numero: '+52 55 9876 5432',
                tipo: 'principal',
                activo: true,
            })).rejects.toThrow('Ya tienes un teléfono activo de tipo principal');
        });
    });

    describe('actualizarTelefono', () => {
        it('debería actualizar teléfono correctamente', async () => {
            const mockTelefonoExistente = {
                id: 'telefono-1',
                projectId: 'studio-1',
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
                projects: { slug: 'test-studio' },
            };

            const mockTelefonoActualizado = {
                ...mockTelefonoExistente,
                numero: '+52 55 9876 5432',
            };

            mockPrisma.project_telefonos.findUnique.mockResolvedValue(mockTelefonoExistente);
            mockPrisma.project_telefonos.update.mockResolvedValue(mockTelefonoActualizado);

            const result = await actualizarTelefono('telefono-1', {
                id: 'telefono-1',
                numero: '+52 55 9876 5432',
            });

            expect(mockPrisma.project_telefonos.update).toHaveBeenCalledWith({
                where: { id: 'telefono-1' },
                data: {
                    numero: '+52 55 9876 5432',
                },
            });

            expect(result).toEqual(mockTelefonoActualizado);
        });

        it('debería lanzar error si el teléfono no existe', async () => {
            mockPrisma.project_telefonos.findUnique.mockResolvedValue(null);

            await expect(actualizarTelefono('telefono-inexistente', {
                id: 'telefono-inexistente',
                numero: '+52 55 1234 5678',
            })).rejects.toThrow('Teléfono no encontrado');
        });
    });

    describe('toggleTelefonoEstado', () => {
        it('debería cambiar estado del teléfono correctamente', async () => {
            const mockTelefonoExistente = {
                id: 'telefono-1',
                projectId: 'studio-1',
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
                projects: { slug: 'test-studio' },
            };

            const mockTelefonoActualizado = {
                ...mockTelefonoExistente,
                activo: false,
            };

            mockPrisma.project_telefonos.findUnique.mockResolvedValue(mockTelefonoExistente);
            mockPrisma.project_telefonos.update.mockResolvedValue(mockTelefonoActualizado);

            const result = await toggleTelefonoEstado('telefono-1', {
                id: 'telefono-1',
                activo: false,
            });

            expect(mockPrisma.project_telefonos.update).toHaveBeenCalledWith({
                where: { id: 'telefono-1' },
                data: { activo: false },
            });

            expect(result).toEqual(mockTelefonoActualizado);
        });
    });

    describe('eliminarTelefono', () => {
        it('debería eliminar teléfono correctamente', async () => {
            const mockTelefonoExistente = {
                id: 'telefono-1',
                projectId: 'studio-1',
                numero: '+52 55 1234 5678',
                tipo: 'principal',
                activo: true,
                projects: { slug: 'test-studio' },
            };

            mockPrisma.project_telefonos.findUnique.mockResolvedValue(mockTelefonoExistente);
            mockPrisma.project_telefonos.delete.mockResolvedValue(mockTelefonoExistente);

            const result = await eliminarTelefono('telefono-1');

            expect(mockPrisma.project_telefonos.delete).toHaveBeenCalledWith({
                where: { id: 'telefono-1' },
            });

            expect(result).toEqual({ success: true });
        });
    });

    describe('actualizarContactoData', () => {
        it('debería actualizar datos de contacto correctamente', async () => {
            const mockStudio = {
                id: 'studio-1',
                slug: 'test-studio',
                address: 'New Address',
                website: 'https://newwebsite.com',
            };

            mockPrisma.projects.update.mockResolvedValue(mockStudio);

            const result = await actualizarContactoData('test-studio', {
                field: 'direccion',
                value: 'New Address',
            });

            expect(mockPrisma.projects.update).toHaveBeenCalledWith({
                where: { slug: 'test-studio' },
                data: {
                    address: 'New Address',
                },
                select: {
                    id: true,
                    slug: true,
                    address: true,
                    website: true,
                },
            });

            expect(result).toEqual({
                direccion: 'New Address',
                website: 'https://newwebsite.com',
            });
        });
    });

    describe('obtenerEstadisticasContacto', () => {
        it('debería obtener estadísticas correctamente', async () => {
            const mockStudio = { id: 'studio-1' };
            const mockEstadisticas = {
                totalTelefonos: 3,
                telefonosActivos: 2,
                telefonosInactivos: 1,
                porcentajeActivos: 67,
                tiposCount: { principal: 1, whatsapp: 1, emergencia: 1 },
            };

            mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
            mockPrisma.project_telefonos.count
                .mockResolvedValueOnce(3)  // total
                .mockResolvedValueOnce(2)  // activos
                .mockResolvedValueOnce(1); // inactivos

            mockPrisma.project_telefonos.findMany.mockResolvedValue([
                { tipo: 'principal', activo: true },
                { tipo: 'whatsapp', activo: true },
                { tipo: 'emergencia', activo: false },
            ]);

            const result = await obtenerEstadisticasContacto('test-studio');

            expect(result).toEqual(mockEstadisticas);
        });
    });

    describe('validarTelefono', () => {
        it('debería validar número de teléfono correctamente', async () => {
            const result = await validarTelefono('+52 55 1234 5678');

            expect(result).toEqual({
                isValid: true,
                formatted: '+525512345678',
                suggestions: [],
            });
        });

        it('debería rechazar número inválido', async () => {
            const result = await validarTelefono('123');

            expect(result).toEqual({
                isValid: false,
                formatted: '123',
                suggestions: [
                    "El número debe contener solo dígitos, espacios, guiones y paréntesis",
                    "El número debe tener entre 7 y 20 caracteres",
                    "Considera agregar el código de país (+52 para México)"
                ],
            });
        });
    });
});
