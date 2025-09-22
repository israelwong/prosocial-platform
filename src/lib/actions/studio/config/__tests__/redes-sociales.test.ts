import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  obtenerRedesSocialesStudio, 
  crearRedSocial, 
  actualizarRedSocial, 
  eliminarRedSocial, 
  toggleRedSocialEstado 
} from '../redes-sociales.actions';

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    projects: {
      findUnique: vi.fn(),
    },
    project_redes_sociales: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Redes Sociales Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener redes sociales del studio', async () => {
    // Arrange
    const mockStudio = { id: 'studio-1', name: 'Test Studio' };
    const mockRedes = [
      { id: 'red-1', url: 'https://facebook.com/test', activo: true },
      { id: 'red-2', url: 'https://instagram.com/test', activo: false },
    ];

    vi.mocked(prisma.projects.findUnique).mockResolvedValue(mockStudio);
    vi.mocked(prisma.project_redes_sociales.findMany).mockResolvedValue(mockRedes);

    // Act
    const result = await obtenerRedesSocialesStudio('test-studio');

    // Assert
    expect(result).toEqual(mockRedes);
    expect(prisma.projects.findUnique).toHaveBeenCalledWith({
      where: { slug: 'test-studio' },
      select: { id: true, name: true },
    });
    expect(prisma.project_redes_sociales.findMany).toHaveBeenCalledWith({
      where: { projectId: 'studio-1' },
      include: { plataforma: true },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('debe crear una red social', async () => {
    // Arrange
    const mockStudio = { id: 'studio-1' };
    const mockNuevaRed = { 
      id: 'red-1', 
      url: 'https://facebook.com/test', 
      activo: true,
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };

    vi.mocked(prisma.projects.findUnique).mockResolvedValue(mockStudio);
    vi.mocked(prisma.project_redes_sociales.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.project_redes_sociales.create).mockResolvedValue(mockNuevaRed);

    const redSocialData = {
      plataformaId: 'plat-1',
      url: 'https://facebook.com/test',
      activo: true,
    };

    // Act
    const result = await crearRedSocial('test-studio', redSocialData);

    // Assert
    expect(result).toEqual(mockNuevaRed);
    expect(prisma.project_redes_sociales.create).toHaveBeenCalledWith({
      data: {
        projectId: 'studio-1',
        plataformaId: 'plat-1',
        url: 'https://facebook.com/test',
        activo: true,
      },
      include: { plataforma: true },
    });
  });

  it('debe actualizar una red social', async () => {
    // Arrange
    const mockRedSocialExistente = {
      id: 'red-1',
      project: { slug: 'test-studio' },
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };
    const mockRedSocialActualizada = {
      id: 'red-1',
      url: 'https://facebook.com/updated',
      activo: false,
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };

    vi.mocked(prisma.project_redes_sociales.findUnique).mockResolvedValue(mockRedSocialExistente);
    vi.mocked(prisma.project_redes_sociales.update).mockResolvedValue(mockRedSocialActualizada);

    const updateData = {
      id: 'red-1',
      url: 'https://facebook.com/updated',
      activo: false,
    };

    // Act
    const result = await actualizarRedSocial('red-1', updateData);

    // Assert
    expect(result).toEqual(mockRedSocialActualizada);
    expect(prisma.project_redes_sociales.update).toHaveBeenCalledWith({
      where: { id: 'red-1' },
      data: {
        url: 'https://facebook.com/updated',
        activo: false,
      },
      include: { plataforma: true },
    });
  });

  it('debe eliminar una red social', async () => {
    // Arrange
    const mockRedSocialExistente = {
      id: 'red-1',
      project: { slug: 'test-studio' },
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };

    vi.mocked(prisma.project_redes_sociales.findUnique).mockResolvedValue(mockRedSocialExistente);
    vi.mocked(prisma.project_redes_sociales.delete).mockResolvedValue(mockRedSocialExistente);

    // Act
    const result = await eliminarRedSocial('red-1');

    // Assert
    expect(result).toEqual({ success: true });
    expect(prisma.project_redes_sociales.delete).toHaveBeenCalledWith({
      where: { id: 'red-1' },
    });
  });

  it('debe toggle el estado de una red social', async () => {
    // Arrange
    const mockRedSocialExistente = {
      id: 'red-1',
      project: { slug: 'test-studio' },
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };
    const mockRedSocialActualizada = {
      id: 'red-1',
      activo: false,
      plataforma: { id: 'plat-1', nombre: 'Facebook' }
    };

    vi.mocked(prisma.project_redes_sociales.findUnique).mockResolvedValue(mockRedSocialExistente);
    vi.mocked(prisma.project_redes_sociales.update).mockResolvedValue(mockRedSocialActualizada);

    const toggleData = {
      id: 'red-1',
      activo: false,
    };

    // Act
    const result = await toggleRedSocialEstado('red-1', toggleData);

    // Assert
    expect(result).toEqual(mockRedSocialActualizada);
    expect(prisma.project_redes_sociales.update).toHaveBeenCalledWith({
      where: { id: 'red-1' },
      data: { activo: false },
      include: { plataforma: true },
    });
  });

  it('debe lanzar error si el studio no existe', async () => {
    // Arrange
    vi.mocked(prisma.projects.findUnique).mockResolvedValue(null);

    // Act & Assert
    await expect(obtenerRedesSocialesStudio('test-studio')).rejects.toThrow('Studio no encontrado');
  });

  it('debe lanzar error si la red social no existe', async () => {
    // Arrange
    vi.mocked(prisma.project_redes_sociales.findUnique).mockResolvedValue(null);

    // Act & Assert
    await expect(actualizarRedSocial('red-1', { id: 'red-1' })).rejects.toThrow('Red social no encontrada');
  });
});