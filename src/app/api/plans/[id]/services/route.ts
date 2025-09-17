import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener servicios de un plan
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: planId } = await params;

        // Obtener todos los servicios ordenados por posición
        const allServices = await prisma.platform_services.findMany({
            orderBy: [
                { posicion: 'asc' },
                { name: 'asc' }
            ]
        });

        // Obtener configuración de servicios para este plan
        const planServices = await prisma.plan_services.findMany({
            where: { plan_id: planId },
            include: {
                service: true
            }
        });

        // Crear un mapa de servicios configurados
        const planServicesMap = new Map(
            planServices.map(ps => [ps.service_id, ps])
        );

        // Combinar servicios con su configuración en el plan
        const servicesWithConfig = allServices.map(service => ({
            ...service,
            planService: planServicesMap.get(service.id) || null
        }));

        return NextResponse.json(servicesWithConfig);
    } catch (error) {
        console.error('Error fetching plan services:', error);
        return NextResponse.json(
            { error: 'Error al obtener servicios del plan' },
            { status: 500 }
        );
    }
}

// POST: Crear o actualizar configuración de servicio en plan
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: planId } = await params;
        const body = await request.json();
        const { service_id, active, limite, unidad } = body;

        if (!service_id) {
            return NextResponse.json(
                { error: 'service_id es requerido' },
                { status: 400 }
            );
        }

        // Verificar que el plan existe
        const plan = await prisma.platform_plans.findUnique({
            where: { id: planId }
        });

        if (!plan) {
            return NextResponse.json(
                { error: 'Plan no encontrado' },
                { status: 404 }
            );
        }

        // Verificar que el servicio existe
        const service = await prisma.platform_services.findUnique({
            where: { id: service_id }
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Servicio no encontrado' },
                { status: 404 }
            );
        }

        // Crear o actualizar la configuración del servicio en el plan
        const planService = await prisma.plan_services.upsert({
            where: {
                plan_id_service_id: {
                    plan_id: planId,
                    service_id: service_id
                }
            },
            update: {
                active,
                limite,
                unidad,
                updatedAt: new Date()
            },
            create: {
                plan_id: planId,
                service_id: service_id,
                active,
                limite,
                unidad
            },
            include: {
                service: true
            }
        });

        return NextResponse.json(planService);
    } catch (error) {
        console.error('Error updating plan service:', error);
        return NextResponse.json(
            { error: 'Error al actualizar servicio del plan' },
            { status: 500 }
        );
    }
}
