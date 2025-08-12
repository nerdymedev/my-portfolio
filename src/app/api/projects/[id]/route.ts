import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'
import mongoose from 'mongoose'

// Ensure this route is dynamic for Vercel
export const dynamic = 'force-dynamic'

// GET /api/projects/[id] - Fetch a single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prevent execution during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'Database not available during build' },
        { status: 503 }
      )
    }
    
    await dbConnect()
    
    const { id } = params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }
    
    const project = await Project.findById(id)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Transform _id to id for frontend compatibility
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json({
      success: true,
      data: transformedProject
    })
  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: any = null
  const { id } = params
  
  try {
    // Prevent execution during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'Database not available during build' },
        { status: 503 }
      )
    }
    
    await dbConnect()
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }
    
    body = await request.json()
    
    // Convert technologies string to array if needed
    if (body.technologies && typeof body.technologies === 'string') {
      body.technologies = body.technologies
        .split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0)
    }
    
    const project = await Project.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Transform _id to id for frontend compatibility
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString(),
      _id: undefined
    }
    
    return NextResponse.json({
      success: true,
      data: transformedProject,
      message: 'Project updated successfully'
    })
  } catch (error: any) {
    console.error('Project update error:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Request body:', body)
    console.error('Project ID:', id)
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { success: false, error: error.message, details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update project', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Prevent execution during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'Database not available during build' },
        { status: 503 }
      )
    }
    
    await dbConnect()
    
    const { id } = params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }
    
    const project = await Project.findByIdAndDelete(id)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Project deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}