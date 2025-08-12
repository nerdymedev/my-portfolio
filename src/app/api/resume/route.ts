import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from '@/lib/mongodb'
import Resume from '@/models/Resume'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    console.log('Processing resume file:', file.name, 'Size:', file.size)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'portfolio-resume',
          public_id: 'resume', // Fixed public_id to always overwrite
          overwrite: true,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    console.log('Upload successful:', result)

    // Connect to database and save resume metadata
    await dbConnect()
    
    // Deactivate any existing resumes
    await Resume.updateMany({}, { isActive: false })
    
    // Construct public URL for raw files
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const publicUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/v${(result as any).version}/${(result as any).public_id}`
    
    // Create new resume record
    const resumeData = {
      filename: 'resume.pdf',
      originalName: file.name,
      cloudinaryUrl: publicUrl,
      cloudinaryPublicId: (result as any).public_id,
      fileSize: file.size,
      uploadedAt: new Date(),
      isActive: true
    }
    
    const resume = new Resume(resumeData)
    await resume.save()

    return NextResponse.json({
      message: 'Resume uploaded successfully',
      url: publicUrl,
      publicId: (result as any).public_id,
      uploadedAt: resume.uploadedAt
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    
    // Get active resume from MongoDB
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 })
    
    if (!resume) {
      return NextResponse.json(
        { error: 'No resume found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      url: resume.cloudinaryUrl,
      uploadedAt: resume.uploadedAt,
      filename: resume.originalName,
      fileSize: resume.fileSize
    })
  } catch (error) {
    console.error('Resume fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await dbConnect()
    
    // Get active resume from MongoDB
    const resume = await Resume.findOne({ isActive: true })
    
    if (!resume) {
      return NextResponse.json(
        { error: 'No resume found to delete' },
        { status: 404 }
      )
    }
    
    // Delete resume from Cloudinary
    await cloudinary.uploader.destroy(resume.cloudinaryPublicId, {
      resource_type: 'raw'
    })
    
    // Delete resume record from MongoDB
    await Resume.findByIdAndDelete(resume._id)

    return NextResponse.json({
      message: 'Resume deleted successfully'
    })
  } catch (error) {
    console.error('Resume delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}