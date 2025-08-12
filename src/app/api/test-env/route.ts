import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      cloudinary_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      cloudinary_api_key: !!process.env.CLOUDINARY_API_KEY,
      cloudinary_api_secret: !!process.env.CLOUDINARY_API_SECRET,
      node_env: process.env.NODE_ENV,
      vercel_url: process.env.VERCEL_URL
    }

    console.log('Environment check:', envCheck)

    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment variables check completed'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}