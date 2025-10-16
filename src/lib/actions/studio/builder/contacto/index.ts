/**
 * Contacto Actions - WRITE operations only
 * 
 * READ operations are handled by builder-profile.actions.ts
 * which fetches all initial data in a single optimized query.
 * 
 * This module includes:
 * - Información básica del studio (descripción, dirección) - UPDATE
 * - Teléfonos de contacto - CRUD
 * - Horarios de atención - CRUD
 * - Zonas de trabajo - CRUD
 */

// Información básica de contacto - WRITE only
export {
    actualizarContacto
} from './contacto.actions';

// Teléfonos - WRITE only (CREATE, UPDATE, DELETE, REORDER)
export {
    crearTelefono,
    actualizarTelefono,
    eliminarTelefono,
    reordenarTelefonos,
    type TelefonoData,
    type TelefonoFormData
} from './telefonos.actions';

// Horarios - WRITE only (CREATE, UPDATE, TOGGLE, INITIALIZE)
export {
    crearHorario,
    actualizarHorario,
    toggleHorarioEstado,
    inicializarHorariosPorDefecto
} from './horarios.actions';

// Zonas de trabajo - WRITE only (CREATE, UPDATE, DELETE, REORDER)
export {
    crearZonaTrabajo,
    actualizarZonaTrabajo,
    eliminarZonaTrabajo,
    reordenarZonasTrabajo,
    type ZonaTrabajoData,
    type ZonaTrabajoFormData
} from './zonas-trabajo.actions';
