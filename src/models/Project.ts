import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrls: string[]
  category: string
  date: string
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  technologies: {
    type: [String],
    required: [true, 'At least one technology is required'],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0
      },
      message: 'At least one technology must be specified'
    }
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true // Optional field
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Please provide a valid URL'
    }
  },
  liveUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true // Optional field
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Please provide a valid URL'
    }
  },
  imageUrls: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: {
      values: ['Web Development', 'Mobile Development', 'AI/ML', 'Blockchain', 'Desktop Application', 'Other'],
      message: 'Category must be one of: Web Development, Mobile Development, AI/ML, Blockchain, Desktop Application, Other'
    }
  },
  date: {
    type: String,
    required: [true, 'Project date is required'],
    validate: {
      validator: function(v: string) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v)
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  }
}, {
  timestamps: true
})

// Create indexes for better query performance
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ technologies: 1 })
ProjectSchema.index({ date: -1 })
ProjectSchema.index({ createdAt: -1 })

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)