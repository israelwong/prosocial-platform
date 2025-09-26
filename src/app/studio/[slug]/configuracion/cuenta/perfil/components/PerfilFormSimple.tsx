'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { actualizarPerfil } from '@/lib/actions/studio/config/perfil.actions';
import { PerfilSchema, type PerfilForm as PerfilFormType } from '@/lib/actions/schemas/perfil-schemas';
import { PerfilData } from '../types';

interface PerfilFormSimpleProps {
    studioSlug: string;
    perfil: PerfilData;
    onPerfilUpdate: (perfil: PerfilData) => void;
}

export function PerfilFormSimple({
    studioSlug,
    perfil,
    onPerfilUpdate
}: PerfilFormSimpleProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<PerfilFormType>({
        resolver: zodResolver(PerfilSchema),
        defaultValues: {
            name: perfil.name,
            email: perfil.email,
            phone: perfil.phone
        }
    });

    const onSubmit = async (data: PerfilFormType) => {
        setLoading(true);
        const loadingToast = toast.loading('Actualizando perfil...');

        try {
            const result = await actualizarPerfil(studioSlug, data);

            if (result.success && result.data) {
                toast.dismiss(loadingToast);
                toast.success(result.message || 'Perfil actualizado exitosamente');

                if (onPerfilUpdate) {
                    onPerfilUpdate(result.data);
                }
            } else {
                // Manejar diferentes tipos de errores
                let errorMessage = 'Hubo un error al actualizar el perfil. Inténtalo de nuevo.';

                if (typeof result.error === 'string') {
                    // Error simple (como email duplicado)
                    errorMessage = result.error;
                } else if (result.error && typeof result.error === 'object') {
                    // Errores de campo (validación Zod)
                    const fieldErrors = Object.values(result.error).flat();
                    errorMessage = fieldErrors[0] || errorMessage;
                }

                toast.dismiss(loadingToast);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.dismiss(loadingToast);
            toast.error('Error interno del servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Información Personal</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Nombre Completo *</span>
                        </Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Tu nombre completo"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Correo Electrónico *</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="tu@email.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Teléfono *</span>
                        </Label>
                        <Input
                            id="phone"
                            {...register('phone')}
                            placeholder="+52 55 1234 5678"
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Botón de guardar */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
