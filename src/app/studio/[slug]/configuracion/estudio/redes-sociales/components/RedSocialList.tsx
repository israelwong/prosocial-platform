'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RedSocialItem } from './RedSocialItem';
import { Plataforma, RedSocial } from '../types';

interface RedSocialListProps {
    redes: RedSocial[];
    plataformas: Plataforma[];
    onEditRed: (red: RedSocial) => void;
    onDeleteRed: (id: string, nombre: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    onAddRedSocial: () => void;
    validateUrl: (url: string) => boolean;
}

export function RedSocialList({
    redes,
    plataformas,
    onEditRed,
    onDeleteRed,
    onToggleActive,
    onAddRedSocial,
    validateUrl
}: RedSocialListProps) {
    const getPlataformaInfo = (plataformaId: string | null) => {
        if (!plataformaId) return null;
        return plataformas.find(p => p.id === plataformaId);
    };

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white">Redes Sociales Configuradas</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona tus enlaces a redes sociales y sitios web
                        </CardDescription>
                    </div>
                    <Button
                        onClick={onAddRedSocial}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Red Social
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {redes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-zinc-400">No tienes redes sociales configuradas</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Usa el botón "Agregar Red Social" para comenzar
                        </p>
                    </div>
                ) : (
                    redes.map((red) => {
                        const plataformaInfo = getPlataformaInfo(red.plataformaId);

                        return (
                            <RedSocialItem
                                key={red.id}
                                red={red}
                                plataformaInfo={plataformaInfo}
                                onEditRed={onEditRed}
                                onDeleteRed={onDeleteRed}
                                onToggleActive={onToggleActive}
                                validateUrl={validateUrl}
                            />
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
