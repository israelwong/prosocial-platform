'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User, Bell } from 'lucide-react';

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-800 bg-zinc-900 px-6 shadow-sm">
            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={onMenuClick}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </Button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg"
                            alt="ProSocial Platform"
                            width={32}
                            height={32}
                            className="h-8 w-8"
                        />
                        <h1 className="text-lg font-semibold text-white">
                            ProSocial Platform
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-700" />
                    
                    {/* Notificaciones - Temporal */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Bell className="h-5 w-5" />
                        {/* Badge de notificaciones */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    <div className="flex items-center gap-x-3">
                        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-zinc-300" />
                        </div>
                        <span className="hidden lg:block text-sm font-medium text-white">
                            Admin User
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
