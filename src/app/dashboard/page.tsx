'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Github, ExternalLink, Calendar, Lock, Mail, Eye, EyeOff, Upload, Image as ImageIcon, FileText, Download } from 'lucide-react'
import Image from 'next/image'
import ImageCarousel from '@/components/ImageCarousel'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrls: string[]
  category: string
  date: string
}

const initialFormData = {
  title: '',
  description: '',
  technologies: '',
  githubUrl: '',
  liveUrl: '',
  imageUrls: [] as string[],
  category: '',
  date: new Date().toISOString().split('T')[0]
}

export default function Dashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Dashboard state
  const [projects, setProjects] = useState<Project[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  
  // Resume management state
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumeUploadedAt, setResumeUploadedAt] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('dashboard-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadProjects()
      loadResume()
    }
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const loadResume = async () => {
    try {
      const response = await fetch('/api/resume')
      if (response.ok) {
        const data = await response.json()
        setResumeUrl(data.url)
        setResumeUploadedAt(data.uploadedAt)
      }
    } catch (error) {
      console.log('No resume found or error loading resume')
    }
  }

  // Remove saveProjects function as we'll use API calls directly

  // Authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple hardcoded credentials (in real app, this would be server-side)
    const validEmail = 'lekzzicon@gmail.com'
    const validPassword = '#Olamilekan123'

    if (loginData.email === validEmail && loginData.password === validPassword) {
      localStorage.setItem('dashboard-auth', 'true')
      setIsAuthenticated(true)
      loadProjects()
    } else {
      setLoginError('Invalid email or password')
    }

    setIsLoggingIn(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('dashboard-auth')
    setIsAuthenticated(false)
    setLoginData({ email: '', password: '' })
  }

  const handleImageUpload = async (file: File) => {
    // Check if we already have 3 images
    if (uploadedImageUrls.length >= 3) {
      alert('Maximum of 3 images allowed per project.')
      return
    }

    setIsUploading(true)
    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size)
      const formData = new FormData()
      formData.append('file', file)

      console.log('Making request to /api/upload')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status, 'OK:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed with status:', response.status, 'Error:', errorText)
        throw new Error(`Upload failed: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('Upload successful, received data:', data)
      const newImageUrls = [...uploadedImageUrls, data.url]
      setUploadedImageUrls(newImageUrls)
      setFormData(prev => ({ ...prev, imageUrls: newImageUrls }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImageUrls = uploadedImageUrls.filter((_, index) => index !== indexToRemove)
    setUploadedImageUrls(newImageUrls)
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      const projectData = {
        ...formData,
        technologies: technologiesArray,
        imageUrls: uploadedImageUrls
      }

      if (editingProject) {
        // Update existing project
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) {
          throw new Error('Failed to update project')
        }
      } else {
        // Add new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) {
          throw new Error('Failed to create project')
        }
      }

      // Reload projects from API
      await loadProjects()
      closeForm()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrls: project.imageUrls,
      category: project.category,
      date: project.date
    })
    setUploadedImageUrls(project.imageUrls || [])
    setIsFormOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete project')
        }

        // Reload projects from API
        await loadProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProject(null)
    setFormData(initialFormData)
    setUploadedImageUrls([])
  }

  // Resume management functions
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploadingResume(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setResumeUrl(data.url)
        setResumeUploadedAt(new Date().toISOString())
        alert('Resume uploaded successfully!')
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      alert('Failed to upload resume')
    } finally {
      setIsUploadingResume(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleResumeDelete = async () => {
    if (!confirm('Are you sure you want to delete the current resume?')) return

    try {
      const response = await fetch('/api/resume', {
        method: 'DELETE'
      })

      if (response.ok) {
        setResumeUrl(null)
        setResumeUploadedAt(null)
        alert('Resume deleted successfully!')
      } else {
        alert('Failed to delete resume')
      }
    } catch (error) {
      console.error('Resume delete error:', error)
      alert('Failed to delete resume')
    }
  }

  const handleResumeDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    }
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 bg-surface dark:bg-background-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Login</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="lekzzicon@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm"
              >
                {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-surface dark:bg-background-dark">
      {/* Header */}
      <section className="section-padding bg-white dark:bg-surface-dark border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold">
                Project <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your portfolio projects
              </p>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Logout
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Management */}
      <section className="section-padding bg-white dark:bg-surface-dark border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Management</h2>
                <p className="text-gray-600 dark:text-gray-300">Upload and manage your resume for visitors to download</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Resume</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={isUploadingResume}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`cursor-pointer flex flex-col items-center gap-3 ${isUploadingResume ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploadingResume ? (
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    )}
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {isUploadingResume ? 'Uploading...' : 'Click to upload resume'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">PDF files only, max 10MB</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Current Resume Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Resume</h3>
                {resumeUrl ? (
                  <div className="bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600 p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Resume.pdf</p>
                        {resumeUploadedAt && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Uploaded: {new Date(resumeUploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleResumeDownload}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={handleResumeDelete}
                        className="btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No resume uploaded</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Upload a PDF resume to make it available for download</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">No projects yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">Start building your portfolio by adding your first project.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                Add Your First Project
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 group"
                >
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Project Images */}
                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <ImageCarousel images={project.imageUrls} alt={project.title} />
                    </div>
                  )}

                  {/* Project Content */}
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={`${project.id}-tech-${techIndex}`}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Date and Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(project.date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-dark rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe your project..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies *
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Images (Max 3)
                  </label>
                  
                  {/* Uploaded Images Grid */}
                  {uploadedImageUrls.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {uploadedImageUrls.map((imageUrl, index) => (
                          <div key={`uploaded-image-${imageUrl}-${index}`} className="relative group">
                            <Image
                              src={imageUrl}
                              alt={`Project image ${index + 1}`}
                              width={96}
                              height={96}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {uploadedImageUrls.length} of 3 images uploaded
                        {uploadedImageUrls.length > 1 && " • Images will display as a carousel"}
                      </p>
                    </div>
                  )}
                  
                  {/* Image Upload Area */}
                  {uploadedImageUrls.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4">
                            <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {uploadedImageUrls.length === 0 
                              ? "Upload project images" 
                              : `Add another image (${3 - uploadedImageUrls.length} remaining)`
                            }
                          </p>
                          <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                            {isUploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                {uploadedImageUrls.length === 0 ? "Choose Images" : "Add Image"}
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file)
                              }}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Supports JPG, PNG, WebP (max 10MB each)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder="https://your-project.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingProject ? 'Update Project' : 'Add Project'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}