'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStudioAuth } from '@/hooks/use-studio-auth'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    User,
    Settings,
    LogOut,
    Menu
} from 'lucide-react'

export function StudioNavigation() {
    const { user, studioUser, signOut } = useStudioAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    if (!user || !studioUser) {
        return null
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
    }

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href={`/${studioUser.studioSlug}`} className="text-xl font-bold text-gray-900">
                                {studioUser.studioName}
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href={`/${studioUser.studioSlug}`}
                                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={`/${studioUser.studioSlug}/projects`}
                                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                            >
                                Proyectos
                            </Link>
                            <Link
                                href={`/${studioUser.studioSlug}/clients`}
                                className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                            >
                                Clientes
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url} alt={studioUser.name || ''} />
                                        <AvatarFallback>{getInitials(studioUser.name || 'U')}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{studioUser.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            Rol: {studioUser.role}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/${studioUser.studioSlug}/settings`}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/${studioUser.studioSlug}/settings`}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configuración</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <Button
                            variant="ghost"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={`/${studioUser.studioSlug}`}
                            className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={`/${studioUser.studioSlug}/projects`}
                            className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Proyectos
                        </Link>
                        <Link
                            href={`/${studioUser.studioSlug}/clients`}
                            className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Clientes
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.user_metadata?.avatar_url} alt={studioUser.name || ''} />
                                    <AvatarFallback>{getInitials(studioUser.name || 'U')}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{studioUser.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <Button
                                variant="ghost"
                                onClick={handleSignOut}
                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                            >
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
