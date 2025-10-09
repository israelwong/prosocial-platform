"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Settings, CreditCard, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/lib/actions/auth/logout.action";
import { getCurrentUserClient } from "@/lib/auth/user-utils-client";
import { ZenButton } from "@/components/ui/zen";
import {
    ZenDropdownMenu,
    ZenDropdownMenuContent,
    ZenDropdownMenuItem,
    ZenDropdownMenuLabel,
    ZenDropdownMenuSeparator,
    ZenDropdownMenuTrigger,
} from "@/components/ui/zen";

interface UserAvatarProps {
    className?: string;
    studioSlug?: string;
}

export function UserAvatar({ className, studioSlug }: UserAvatarProps) {
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const getUser = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    // Obtener perfil completo del usuario desde la base de datos
                    const authUser = await getCurrentUserClient();
                    if (authUser) {
                        setUserProfile(authUser.profile);
                    }
                }
            } catch (error) {
                console.error("Error getting user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Obtener información del usuario con fallbacks
    const userName = userProfile?.fullName || user.user_metadata?.full_name || user.email || "Usuario";
    const userEmail = user.email;
    const avatarUrl = userProfile?.avatarUrl;

    // Generar iniciales para el fallback
    const userInitials = userName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Determinar rutas basadas en la ruta actual
    const isInConfiguracion = pathname.includes('/configuracion');
    const basePath = studioSlug ? `/${studioSlug}/studio` : '';

    // Rutas del menú
    const menuRoutes = {
        perfil: `${basePath}/configuracion/cuenta/perfil`,
        suscripcion: `${basePath}/configuracion/cuenta/suscripcion`,
        configuracion: isInConfiguracion ? `${basePath}/dashboard` : `${basePath}/configuracion`
    };

    return (
        <ZenDropdownMenu>
            <ZenDropdownMenuTrigger asChild>
                <ZenButton
                    variant="ghost"
                    size="icon"
                    className={`rounded-full hover:bg-zinc-800 ${className}`}
                >
                    {avatarUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                                src={avatarUrl}
                                alt={userName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Si la imagen falla al cargar, mostrar fallback
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800 items-center justify-center text-white text-sm font-medium hidden">
                                {userInitials}
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {userInitials}
                        </div>
                    )}
                </ZenButton>
            </ZenDropdownMenuTrigger>

            <ZenDropdownMenuContent align="end" className="w-56">
                <ZenDropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-zinc-500">{userEmail}</p>
                    </div>
                </ZenDropdownMenuLabel>

                <ZenDropdownMenuSeparator />

                <ZenDropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={menuRoutes.perfil}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </Link>
                </ZenDropdownMenuItem>

                <ZenDropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={menuRoutes.suscripcion}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Suscripción</span>
                    </Link>
                </ZenDropdownMenuItem>

                <ZenDropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={menuRoutes.configuracion}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{isInConfiguracion ? 'Dashboard' : 'Configuración'}</span>
                    </Link>
                </ZenDropdownMenuItem>

                <ZenDropdownMenuSeparator />

                <ZenDropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-300"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
                </ZenDropdownMenuItem>
            </ZenDropdownMenuContent>
        </ZenDropdownMenu>
    );
}
