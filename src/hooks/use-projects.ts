'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStudioAuth } from './use-studio-auth'

interface Project {
    id: string
    name: string
    description?: string
    event_date: string
    status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED' | 'CANCELLED'
    location?: string
    event_type?: string
    total_value: number
    client: {
        id: string
        name: string
        email?: string
        phone?: string
    }
    quotations: Array<{
        id: string
        total: number
        status: string
    }>
    createdAt: string
    updatedAt: string
}

interface CreateProjectData {
    name: string
    description?: string
    event_date?: string
    status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    location?: string
    event_type?: string
    client_id?: string
    // Para crear nuevo cliente
    client_name?: string
    client_email?: string
    client_phone?: string
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { studioUser } = useStudioAuth()

    const fetchProjects = useCallback(async () => {
        if (!studioUser) return

        try {
            setLoading(true)
            const response = await fetch('/api/projects', {
                headers: {
                    'x-studio-slug': studioUser.studioSlug
                }
            })

            if (!response.ok) {
                throw new Error('Error fetching projects')
            }

            const data = await response.json()
            setProjects(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }, [studioUser])

    const createProject = async (projectData: CreateProjectData) => {
        if (!studioUser) return null

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-studio-slug': studioUser.studioSlug
                },
                body: JSON.stringify(projectData)
            })

            if (!response.ok) {
                throw new Error('Error creating project')
            }

            const newProject = await response.json()
            setProjects(prev => [newProject, ...prev])
            return newProject
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            return null
        }
    }

    const updateProject = async (id: string, projectData: Partial<CreateProjectData>) => {
        if (!studioUser) return null

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-studio-slug': studioUser.studioSlug
                },
                body: JSON.stringify(projectData)
            })

            if (!response.ok) {
                throw new Error('Error updating project')
            }

            const updatedProject = await response.json()
            setProjects(prev =>
                prev.map(project =>
                    project.id === id ? updatedProject : project
                )
            )
            return updatedProject
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            return null
        }
    }

    const deleteProject = async (id: string) => {
        if (!studioUser) return false

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-studio-slug': studioUser.studioSlug
                }
            })

            if (!response.ok) {
                throw new Error('Error deleting project')
            }

            setProjects(prev => prev.filter(project => project.id !== id))
            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            return false
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [studioUser, fetchProjects])

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects
    }
}
