import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // Obtener proyecto específico del studio
        const project = await prisma.project.findFirst({
            where: {
                id: id,
                studio_id: studio.id
            },
            include: {
                client: true,
                quotations: true
            }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error('Error fetching project:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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
            status,
            location,
            event_type
        } = body

        // Actualizar el proyecto
        const project = await prisma.project.update({
            where: {
                id: id,
                studio_id: studio.id
            },
            data: {
                name,
                description,
                event_date: event_date ? new Date(event_date) : undefined,
                status,
                location,
                event_type
            },
            include: {
                client: true,
                quotations: true
            }
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // Soft delete - archivar el proyecto
        const project = await prisma.project.update({
            where: {
                id: id,
                studio_id: studio.id
            },
            data: {
                archived_at: new Date(),
                status: 'ARCHIVED'
            }
        })

        return NextResponse.json({ message: 'Project archived successfully', project })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
