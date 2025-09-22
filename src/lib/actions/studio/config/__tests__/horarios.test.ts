import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  obtenerHorariosStudio,
  crearHorario,
  actualizarHorario,
  toggleHorarioEstado,
  eliminarHorario,
  obtenerEstadisticasHorarios,
  inicializarHorariosPorDefecto
} from '../horarios.actions';

// Mock de Prisma
const mockPrisma = {
  projects: {
    findUnique: vi.fn(),
  },
  project_horarios_atencion: {
    findMany: vi.fn(),
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

describe('Horarios Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('obtenerHorariosStudio', () => {
    it('debería obtener horarios del studio correctamente', async () => {
      const mockStudio = { id: 'studio-1', name: 'Test Studio' };
      const mockHorarios = [
        {
          id: 'horario-1',
          projectId: 'studio-1',
          dia_semana: 'lunes',
          hora_inicio: '09:00',
          hora_fin: '18:00',
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.findMany.mockResolvedValue(mockHorarios);

      const result = await obtenerHorariosStudio('test-studio');

      expect(mockPrisma.projects.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-studio' },
        select: { id: true, name: true },
      });

      expect(mockPrisma.project_horarios_atencion.findMany).toHaveBeenCalledWith({
        where: { projectId: 'studio-1' },
        orderBy: [
          { dia_semana: 'asc' },
          { hora_inicio: 'asc' }
        ],
      });

      expect(result).toEqual(mockHorarios);
    });

    it('debería lanzar error si el studio no existe', async () => {
      mockPrisma.projects.findUnique.mockResolvedValue(null);

      await expect(obtenerHorariosStudio('studio-inexistente')).rejects.toThrow('Studio no encontrado');
    });

    it('debería aplicar filtros correctamente', async () => {
      const mockStudio = { id: 'studio-1', name: 'Test Studio' };
      const mockHorarios = [];

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.findMany.mockResolvedValue(mockHorarios);

      await obtenerHorariosStudio('test-studio', { activo: true, dia_semana: 'lunes' });

      expect(mockPrisma.project_horarios_atencion.findMany).toHaveBeenCalledWith({
        where: {
          projectId: 'studio-1',
          activo: true,
          dia_semana: 'lunes',
        },
        orderBy: [
          { dia_semana: 'asc' },
          { hora_inicio: 'asc' }
        ],
      });
    });
  });

  describe('crearHorario', () => {
    it('debería crear horario correctamente', async () => {
      const mockStudio = { id: 'studio-1' };
      const mockNuevoHorario = {
        id: 'horario-1',
        projectId: 'studio-1',
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(null);
      mockPrisma.project_horarios_atencion.create.mockResolvedValue(mockNuevoHorario);

      const result = await crearHorario('test-studio', {
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
      });

      expect(mockPrisma.project_horarios_atencion.create).toHaveBeenCalledWith({
        data: {
          projectId: 'studio-1',
          dia_semana: 'lunes',
          hora_inicio: '09:00',
          hora_fin: '18:00',
          activo: true,
        },
      });

      expect(result).toEqual(mockNuevoHorario);
    });

    it('debería lanzar error si ya existe horario para ese día', async () => {
      const mockStudio = { id: 'studio-1' };
      const mockHorarioExistente = {
        id: 'horario-1',
        projectId: 'studio-1',
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
      };

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(mockHorarioExistente);

      await expect(crearHorario('test-studio', {
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
      })).rejects.toThrow('Ya existe un horario configurado para lunes');
    });
  });

  describe('actualizarHorario', () => {
    it('debería actualizar horario correctamente', async () => {
      const mockHorarioExistente = {
        id: 'horario-1',
        projectId: 'studio-1',
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
        projects: { slug: 'test-studio' },
      };

      const mockHorarioActualizado = {
        ...mockHorarioExistente,
        hora_inicio: '10:00',
        hora_fin: '19:00',
      };

      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(mockHorarioExistente);
      mockPrisma.project_horarios_atencion.update.mockResolvedValue(mockHorarioActualizado);

      const result = await actualizarHorario('horario-1', {
        id: 'horario-1',
        hora_inicio: '10:00',
        hora_fin: '19:00',
      });

      expect(mockPrisma.project_horarios_atencion.update).toHaveBeenCalledWith({
        where: { id: 'horario-1' },
        data: {
          hora_inicio: '10:00',
          hora_fin: '19:00',
        },
      });

      expect(result).toEqual(mockHorarioActualizado);
    });

    it('debería lanzar error si el horario no existe', async () => {
      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(null);

      await expect(actualizarHorario('horario-inexistente', {
        id: 'horario-inexistente',
        hora_inicio: '10:00',
      })).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('toggleHorarioEstado', () => {
    it('debería cambiar estado del horario correctamente', async () => {
      const mockHorarioExistente = {
        id: 'horario-1',
        projectId: 'studio-1',
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
        projects: { slug: 'test-studio' },
      };

      const mockHorarioActualizado = {
        ...mockHorarioExistente,
        activo: false,
      };

      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(mockHorarioExistente);
      mockPrisma.project_horarios_atencion.update.mockResolvedValue(mockHorarioActualizado);

      const result = await toggleHorarioEstado('horario-1', {
        id: 'horario-1',
        activo: false,
      });

      expect(mockPrisma.project_horarios_atencion.update).toHaveBeenCalledWith({
        where: { id: 'horario-1' },
        data: { activo: false },
      });

      expect(result).toEqual(mockHorarioActualizado);
    });
  });

  describe('eliminarHorario', () => {
    it('debería eliminar horario correctamente', async () => {
      const mockHorarioExistente = {
        id: 'horario-1',
        projectId: 'studio-1',
        dia_semana: 'lunes',
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true,
        projects: { slug: 'test-studio' },
      };

      mockPrisma.project_horarios_atencion.findUnique.mockResolvedValue(mockHorarioExistente);
      mockPrisma.project_horarios_atencion.delete.mockResolvedValue(mockHorarioExistente);

      const result = await eliminarHorario('horario-1');

      expect(mockPrisma.project_horarios_atencion.delete).toHaveBeenCalledWith({
        where: { id: 'horario-1' },
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe('obtenerEstadisticasHorarios', () => {
    it('debería obtener estadísticas correctamente', async () => {
      const mockStudio = { id: 'studio-1' };
      const mockEstadisticas = {
        total: 7,
        activos: 6,
        inactivos: 1,
        diasConfigurados: 7,
        diasActivos: 6,
        porcentajeActivos: 86,
        porcentajeDiasActivos: 86,
      };

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.count
        .mockResolvedValueOnce(7)  // total
        .mockResolvedValueOnce(6)  // activos
        .mockResolvedValueOnce(1); // inactivos

      mockPrisma.project_horarios_atencion.findMany.mockResolvedValue([
        { dia_semana: 'lunes', activo: true },
        { dia_semana: 'martes', activo: true },
        { dia_semana: 'miercoles', activo: true },
        { dia_semana: 'jueves', activo: true },
        { dia_semana: 'viernes', activo: true },
        { dia_semana: 'sabado', activo: true },
        { dia_semana: 'domingo', activo: false },
      ]);

      const result = await obtenerEstadisticasHorarios('test-studio');

      expect(result).toEqual(mockEstadisticas);
    });
  });

  describe('inicializarHorariosPorDefecto', () => {
    it('debería inicializar horarios por defecto correctamente', async () => {
      const mockStudio = { id: 'studio-1' };
      const mockHorariosCreados = [
        { id: 'horario-1', dia_semana: 'lunes', hora_inicio: '09:00', hora_fin: '18:00', activo: true },
        { id: 'horario-2', dia_semana: 'martes', hora_inicio: '09:00', hora_fin: '18:00', activo: true },
      ];

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.count.mockResolvedValue(0);
      mockPrisma.project_horarios_atencion.$transaction.mockResolvedValue(mockHorariosCreados);

      const result = await inicializarHorariosPorDefecto('test-studio');

      expect(mockPrisma.project_horarios_atencion.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockHorariosCreados);
    });

    it('debería lanzar error si ya tiene horarios configurados', async () => {
      const mockStudio = { id: 'studio-1' };

      mockPrisma.projects.findUnique.mockResolvedValue(mockStudio);
      mockPrisma.project_horarios_atencion.count.mockResolvedValue(3);

      await expect(inicializarHorariosPorDefecto('test-studio')).rejects.toThrow(
        'El studio ya tiene horarios configurados'
      );
    });
  });
});
