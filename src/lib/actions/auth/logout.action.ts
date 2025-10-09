"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Cierra la sesión del usuario y redirige al login
 */
export async function logout() {
    try {
        const supabase = await createClient();

        // Cerrar sesión en Supabase
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error al cerrar sesión:", error);
            throw new Error("Error al cerrar sesión");
        }

        console.log("✅ Sesión cerrada exitosamente");

        // Redirigir al login
        redirect("/login");

    } catch (error) {
        console.error("Error en logout:", error);
        // Aún así redirigir al login en caso de error
        redirect("/login");
    }
}
