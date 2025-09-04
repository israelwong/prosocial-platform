import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const studioSlug = request.headers.get('x-studio-slug')

        if (!studioSlug) {
            return NextResponse.json({ error: 'Studio not found' }, { status: 400 })
        }

        // Obtener el studio
        const studio = await prisma.studio.findUnique({
            where: { slug: studioSlug }
        })

        if (!studio) {
            return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
        }

        // Obtener proyectos del studio con clientes
        const projects = await prisma.project.findMany({
            where: { studio_id: studio.id },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                quotations: {
                    select: {
                        id: true,
                        total: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const studioSlug = request.headers.get('x-studio-slug')

        if (!studioSlug) {
            return NextResponse.json({ error: 'Studio not found' }, { status: 400 })
        }

        // Obtener el studio
        const studio = await prisma.studio.findUnique({
            where: { slug: studioSlug }
        })

        if (!studio) {
            return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
        }

        const body = await request.json()
        const {
            name,
            description,
            event_date,
            status = 'PENDING',
            client_id,
            // Datos del cliente si es nuevo
            client_name,
            client_email,
            client_phone
        } = body

        // Si no hay client_id, crear un nuevo cliente
        let clientId = client_id
        if (!clientId && client_name) {
            const newClient = await prisma.client.create({
                data: {
                    name: client_name,
                    email: client_email,
                    phone: client_phone,
                    studio_id: studio.id
                }
            })
            clientId = newClient.id
        }

        if (!clientId) {
            return NextResponse.json(
                { error: 'Client information is required' },
                { status: 400 }
            )
        }

        // Crear el proyecto
        const project = await prisma.project.create({
            data: {
                name,
                description,
                event_date: event_date ? new Date(event_date) : new Date(),
                status,
                client_id: clientId,
                studio_id: studio.id
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
