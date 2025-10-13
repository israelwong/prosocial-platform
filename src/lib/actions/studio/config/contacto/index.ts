/**
 * Contacto Actions - Módulo unificado para gestión de información de contacto
 * 
 * Incluye:
 * - Información básica del studio (descripción, dirección)
 * - Teléfonos de contacto
 * - Horarios de atención
 * - Zonas de trabajo
 */

// Información básica de contacto
export {
    obtenerContactoStudio,
    actualizarContacto
} from './contacto.actions';

// Teléfonos
export {
    obtenerTelefonosStudio,
    crearTelefono,
    actualizarTelefono,
    eliminarTelefono,
    reordenarTelefonos,
    type TelefonoData,
    type TelefonoFormData
} from './telefonos.actions';

// Horarios
export {
    obtenerHorariosStudio,
    crearHorario,
    actualizarHorario,
    toggleHorarioEstado,
    inicializarHorariosPorDefecto
} from './horarios.actions';

// Zonas de trabajo
export {
    obtenerZonasTrabajoStudio,
    crearZonaTrabajo,
    actualizarZonaTrabajo,
    eliminarZonaTrabajo,
    reordenarZonasTrabajo,
    type ZonaTrabajoData,
    type ZonaTrabajoFormData
} from './zonas-trabajo.actions';
