import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase con permisos de administrador
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Clave de servicio para operaciones admin
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export { supabaseAdmin };
