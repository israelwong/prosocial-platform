"use client";

import React from 'react';
import { usePlatformContact } from '@/hooks/usePlatformConfig';
import { Phone, Mail, MessageCircle } from 'lucide-react';

interface ContactInfoProps {
    type?: 'comercial' | 'soporte' | 'both';
    className?: string;
    showIcons?: boolean;
}

export function ContactInfo({ 
    type = 'both', 
    className = "",
    showIcons = true 
}: ContactInfoProps) {
    const contact = usePlatformContact();

    if (type === 'comercial') {
        return (
            <div className={className}>
                {contact.comercial.telefono && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <Phone className="w-4 h-4" />}
                        <span>{contact.comercial.telefono}</span>
                    </div>
                )}
                {contact.comercial.email && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <Mail className="w-4 h-4" />}
                        <span>{contact.comercial.email}</span>
                    </div>
                )}
                {contact.comercial.whatsapp && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <MessageCircle className="w-4 h-4" />}
                        <span>{contact.comercial.whatsapp}</span>
                    </div>
                )}
            </div>
        );
    }

    if (type === 'soporte') {
        return (
            <div className={className}>
                {contact.soporte.telefono && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <Phone className="w-4 h-4" />}
                        <span>{contact.soporte.telefono}</span>
                    </div>
                )}
                {contact.soporte.email && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <Mail className="w-4 h-4" />}
                        <span>{contact.soporte.email}</span>
                    </div>
                )}
                {contact.soporte.chat_url && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {showIcons && <MessageCircle className="w-4 h-4" />}
                        <a href={contact.soporte.chat_url} className="hover:text-white transition-colors">
                            Chat de Soporte
                        </a>
                    </div>
                )}
            </div>
        );
    }

    // type === 'both'
    return (
        <div className={className}>
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Comercial</h4>
                <ContactInfo type="comercial" showIcons={showIcons} />
            </div>
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Soporte</h4>
                <ContactInfo type="soporte" showIcons={showIcons} />
            </div>
        </div>
    );
}