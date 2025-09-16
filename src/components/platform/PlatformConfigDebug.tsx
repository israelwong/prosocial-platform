"use client";

import React, { useState, useEffect } from 'react';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';
import { Bug, X, RefreshCw, Minimize } from 'lucide-react';

export function PlatformConfigDebug() {
    const { config, loading, error, refetch } = usePlatformConfig();
    const [isVisible, setIsVisible] = useState(true); // Abierto por defecto para pruebas
    const [isMinimized, setIsMinimized] = useState(false);

    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    // Toggle con Ctrl+Shift+D
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsVisible(!isVisible);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible]);

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Platform Config Debug (Ctrl+Shift+D)"
                >
                    <Bug className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-4 right-4 bg-black bg-opacity-90 text-white rounded-lg shadow-xl z-50 transition-all duration-300 ${isMinimized ? 'w-12 h-12' : 'w-80 max-h-96'
            }`}>
            {!isMinimized ? (
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <Bug className="w-4 h-4" />
                            Platform Config Debug
                        </h3>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={refetch}
                                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                title="Refrescar configuración"
                            >
                                <RefreshCw className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="p-1 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
                                title="Minimizar"
                            >
                                <Minimize className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                                title="Cerrar completamente"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                            <div className={`px-2 py-1 rounded text-center ${loading ? 'bg-yellow-500 bg-opacity-30' : 'bg-green-500 bg-opacity-30'
                                }`}>
                                Loading: {loading ? 'true' : 'false'}
                            </div>
                            <div className={`px-2 py-1 rounded text-center ${error ? 'bg-red-500 bg-opacity-30' : 'bg-green-500 bg-opacity-30'
                                }`}>
                                Error: {error ? 'yes' : 'none'}
                            </div>
                        </div>

                        <div className={`px-2 py-1 rounded text-center ${config ? 'bg-green-500 bg-opacity-30' : 'bg-gray-500 bg-opacity-30'
                            }`}>
                            Config: {config ? 'loaded' : 'null'}
                        </div>

                        {error && (
                            <div className="bg-red-500 bg-opacity-20 p-2 rounded text-red-200">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {config && (
                            <div className="space-y-1">
                                <div className="bg-blue-500 bg-opacity-20 p-2 rounded">
                                    <div><strong>Nombre:</strong> {config.nombre_empresa}</div>
                                    <div><strong>Logo:</strong> {config.logo_url || 'none'}</div>
                                    <div><strong>Favicon:</strong> {config.favicon_url || 'none'}</div>
                                </div>

                                <div className="bg-purple-500 bg-opacity-20 p-2 rounded">
                                    <div><strong>Comercial:</strong></div>
                                    <div>• Tel: {config.comercial_telefono || 'none'}</div>
                                    <div>• Email: {config.comercial_email || 'none'}</div>
                                    <div>• WhatsApp: {config.comercial_whatsapp || 'none'}</div>
                                </div>

                                <div className="bg-orange-500 bg-opacity-20 p-2 rounded">
                                    <div><strong>Soporte:</strong></div>
                                    <div>• Tel: {config.soporte_telefono || 'none'}</div>
                                    <div>• Email: {config.soporte_email || 'none'}</div>
                                    <div>• Chat: {config.soporte_chat_url || 'none'}</div>
                                </div>

                                <div className="bg-green-500 bg-opacity-20 p-2 rounded">
                                    <div><strong>Redes Sociales:</strong></div>
                                    <div>• Facebook: {config.facebook_url || 'none'}</div>
                                    <div>• Instagram: {config.instagram_url || 'none'}</div>
                                    <div>• Twitter: {config.twitter_url || 'none'}</div>
                                    <div>• LinkedIn: {config.linkedin_url || 'none'}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white border-opacity-20 text-xs text-gray-300">
                        <div>💡 <strong>Controles:</strong></div>
                        <div>• <kbd className="bg-gray-700 px-1 rounded">Ctrl+Shift+D</kbd> Toggle debug</div>
                        <div>• <kbd className="bg-blue-500 px-1 rounded">−</kbd> Minimizar</div>
                        <div>• <kbd className="bg-red-500 px-1 rounded">×</kbd> Cerrar</div>
                        <div>• <kbd className="bg-gray-500 px-1 rounded">↻</kbd> Refresh</div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsMinimized(false)}
                    className="w-full h-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors"
                    title="Expandir debug"
                >
                    <Bug className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
