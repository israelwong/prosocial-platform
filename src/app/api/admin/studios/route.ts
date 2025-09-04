import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // TODO: Verificar que el usuario sea administrador de la plataforma

        const studios = await prisma.studio.findMany({
            include: {
                plan: {
                    select: {
                        name: true,
                        activeProjectLimit: true
                    }
                },
                _count: {
                    select: {
                        eventos: true,
                        clientes: true,
                        cotizaciones: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Calcular métricas adicionales
        const studiosWithMetrics = studios.map(studio => ({
            ...studio,
            monthlyRevenue: Math.floor(Math.random() * 10000), // TODO: Calcular revenue real
            lastActivity: new Date().toISOString() // TODO: Calcular última actividad real
        }))

        return NextResponse.json(studiosWithMetrics)
    } catch (error) {
        console.error('Error fetching studios:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // TODO: Verificar que el usuario sea administrador de la plataforma

        const body = await request.json()
        const {
            name,
            slug,
            email,
            phone,
            address,
            planId
        } = body

        // Verificar que el slug no exista
        const existingStudio = await prisma.studio.findUnique({
            where: { slug }
        })

        if (existingStudio) {
            return NextResponse.json(
                { error: 'Studio slug already exists' },
                { status: 400 }
            )
        }

        // Buscar el plan
        const plan = await prisma.plan.findUnique({
            where: { slug: planId }
        })

        if (!plan) {
            return NextResponse.json(
                { error: 'Plan not found' },
                { status: 400 }
            )
        }

        // Crear el studio
        const studio = await prisma.studio.create({
            data: {
                name,
                slug,
                email,
                phone,
                address,
                planId: plan.id,
                subscriptionStatus: 'trial', // Empezar con trial
                subscriptionStart: new Date(),
                commissionRate: 0.30 // 30% para ProSocial
            },
            include: {
                plan: {
                    select: {
                        name: true,
                        activeProjectLimit: true
                    }
                },
                _count: {
                    select: {
                        eventos: true,
                        clientes: true,
                        cotizaciones: true
                    }
                }
            }
        })

        const studioWithMetrics = {
            ...studio,
            monthlyRevenue: 0,
            lastActivity: new Date().toISOString()
        }

        return NextResponse.json(studioWithMetrics, { status: 201 })
    } catch (error) {
        console.error('Error creating studio:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
