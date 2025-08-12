import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

// Ensure this route is dynamic for Vercel
export const dynamic = 'force-dynamic'

// GET /api/projects - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '0')
    const sort = searchParams.get('sort') || '-createdAt'
    
    let query: any = {}
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Search in title, description, and technologies
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    let projectsQuery = Project.find(query).sort(sort)
    
    if (limit > 0) {
      projectsQuery = projectsQuery.limit(limit)
    }
    
    const projects = await projectsQuery.exec()
    
    // Transform _id to id for frontend compatibility
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      id: project._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json({
      success: true,
      projects: transformedProjects,
      count: transformedProjects.length
    })
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Validate required fields
    const { title, description, technologies, category, date } = body
    
    if (!title || !description || !technologies || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Convert technologies string to array if needed
    const techArray = Array.isArray(technologies) 
      ? technologies 
      : technologies.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech.length > 0)
    
    const projectData = {
      ...body,
      technologies: techArray
    }
    
    const project = new Project(projectData)
    await project.save()
    
    // Transform _id to id for frontend compatibility
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json({
      success: true,
      project: transformedProject,
      message: 'Project created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Project creation error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}