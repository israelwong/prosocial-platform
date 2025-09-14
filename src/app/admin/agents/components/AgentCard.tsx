import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    User,
    Phone,
    Mail
} from 'lucide-react';
import Link from 'next/link';

interface Agent {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    activo: boolean;
    metaMensualLeads: number;
    comisionConversion: number;
    createdAt: Date;
    _count: {
        leads: number;
    };
}

interface AgentCardProps {
    agent: Agent;
    onDelete?: (agentId: string) => void;
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
    const handleDelete = () => {
        if (onDelete) {
            onDelete(agent.id);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agent.nombre}</h3>
                        <Badge variant={agent.activo ? "default" : "secondary"}>
                            {agent.activo ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {agent.email}
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {agent.telefono}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="text-right space-y-1">
                    <div className="text-sm font-medium">
                        {agent._count.leads} leads asignados
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Meta: {agent.metaMensualLeads}/mes
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Comisión: {(Number(agent.comisionConversion) * 100).toFixed(2)}%
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}`}>
                                <User className="mr-2 h-4 w-4" />
                                Ver Detalles
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
