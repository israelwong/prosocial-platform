/**
 * Profile Sections - Componentes para diferentes secciones del perfil
 * 
 * Secciones principales (visibles en menú):
 * - Inicio/Portafolio: PostGridView
 * - Catálogo: ShopView  
 * - Contacto: InfoView
 * 
 * Secciones adicionales (rutas específicas):
 * - Payments: PaymentsView (/[slug]/payment)
 * - Clientes: ClientesView (/[slug]/cliente)
 */

// Secciones principales
export { PostGridView } from './PostGridView';
export { ShopView } from './ShopView';
export { InfoView } from './InfoView';
export { ProductCard } from './ProductCard';

// Secciones adicionales
export { PaymentsView } from './PaymentsView';
export { ClientesView } from './ClientesView';
