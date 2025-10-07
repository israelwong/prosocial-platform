'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ZenSidebarMenuButton } from '@/components/ui/zen';

type ActiveLinkProps = LinkProps & {
    children: React.ReactNode;
    className?: string;
};

export function ActiveLink({ children, href, ...props }: ActiveLinkProps) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href as string);

    return (
        <ZenSidebarMenuButton asChild isActive={isActive}>
            <Link href={href} {...props}>
                <div className="flex items-center gap-3">
                    {children}
                </div>
            </Link>
        </ZenSidebarMenuButton>
    );
}
