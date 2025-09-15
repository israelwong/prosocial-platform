import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const plan = await prisma.plans.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        studios: true,
                        subscriptions: true
                    }
                }
            }
        });

        if (!plan) {
            return NextResponse.json(
                { error: "Plan no encontrado" },
                { status: 404 }
            );
        }

        // Convertir Decimal a number para el frontend
        const planFormatted = {
            ...plan,
            price_monthly: plan.price_monthly ? Number(plan.price_monthly) : null,
            price_yearly: plan.price_yearly ? Number(plan.price_yearly) : null
        };

        return NextResponse.json(planFormatted);
    } catch (error) {
        console.error("Error fetching plan:", error);
        return NextResponse.json(
            { error: "Error al cargar el plan" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;

        // Verificar que el plan existe
        const existingPlan = await prisma.plans.findUnique({
            where: { id }
        });

        if (!existingPlan) {
            return NextResponse.json(
                { error: "Plan no encontrado" },
                { status: 404 }
            );
        }

        // Parsear JSON fields si vienen como strings y filtrar campos no actualizables
        const { _count, createdAt, ...updateableFields } = body;

        const planData: any = { ...updateableFields };

        // Solo procesar features si está presente en el body
        if ('features' in body) {
            planData.features = typeof body.features === 'string' ?
                JSON.parse(body.features || '[]') : body.features;
        }

        // Solo procesar limits si está presente en el body
        if ('limits' in body) {
            planData.limits = typeof body.limits === 'string' ?
                JSON.parse(body.limits || '{}') : body.limits;
        }

        const plan = await prisma.plans.update({
            where: { id },
            data: planData,
            include: {
                _count: {
                    select: {
                        studios: true,
                        subscriptions: true
                    }
                }
            }
        });

        // Si se actualizó el orden, normalizar todos los planes activos
        if ('orden' in planData) {
            const activePlans = await prisma.plans.findMany({
                where: { active: true },
                orderBy: [
                    { orden: 'asc' },
                    { createdAt: 'asc' }
                ]
            });

            // Normalizar el orden
            const normalizePromises = activePlans.map((p, index) =>
                prisma.plans.update({
                    where: { id: p.id },
                    data: { orden: index + 1 }
                })
            );

            await Promise.all(normalizePromises);
        }

        // Convertir Decimal a number para el frontend
        const planFormatted = {
            ...plan,
            price_monthly: plan.price_monthly ? Number(plan.price_monthly) : null,
            price_yearly: plan.price_yearly ? Number(plan.price_yearly) : null
        };

        return NextResponse.json(planFormatted);
    } catch (error) {
        console.error("Error updating plan:", error);

        // Manejo de errores específicos
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    { error: "Ya existe un plan con ese slug" },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: "Error al actualizar el plan" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verificar que el plan existe
        const existingPlan = await prisma.plans.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        studios: true,
                        subscriptions: true
                    }
                }
            }
        });

        if (!existingPlan) {
            return NextResponse.json(
                { error: "Plan no encontrado" },
                { status: 404 }
            );
        }

        // Verificar si el plan tiene estudios o suscripciones activas
        if (existingPlan._count.studios > 0 || existingPlan._count.subscriptions > 0) {
            return NextResponse.json(
                { error: "No se puede eliminar un plan que tiene estudios o suscripciones activas. Desactívalo en su lugar." },
                { status: 409 }
            );
        }

        await prisma.plans.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting plan:", error);
        return NextResponse.json(
            { error: "Error al eliminar el plan" },
            { status: 500 }
        );
    }
}
