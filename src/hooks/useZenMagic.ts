'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manejar el estado de ZEN Magic Chat
 * 
 * Características implementadas:
 * - Persistencia de estado en localStorage
 * - Sincronización entre pestañas
 * 
 * TODO: Implementar funcionalidades futuras:
 * - Contexto automático basado en ruta
 * - Gestión de pestañas por módulo
 * - Integración con IA/LLM
 */
export function useZenMagic() {
    const [isOpen, setIsOpen] = useState(false);

    // Cargar estado inicial desde localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('zen-magic-chat-open');
        if (savedState !== null) {
            setIsOpen(JSON.parse(savedState));
        }
    }, []);

    // Persistir estado en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('zen-magic-chat-open', JSON.stringify(isOpen));
    }, [isOpen]);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const openChat = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        toggleChat,
        openChat,
        closeChat
    };
}
