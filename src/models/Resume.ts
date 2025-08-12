import mongoose, { Document, Schema } from 'mongoose'

export interface IResume extends Document {
  filename: string
  originalName: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  fileSize: number
  uploadedAt: Date
  isActive: boolean
}

const ResumeSchema = new Schema<IResume>({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  cloudinaryUrl: {
    type: String,
    required: [true, 'Cloudinary URL is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Please provide a valid URL'
    }
  },
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative'],
    max: [10485760, 'File size cannot exceed 10MB'] // 10MB in bytes
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Ensure only one active resume at a time
ResumeSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } })
ResumeSchema.index({ uploadedAt: -1 })

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema)