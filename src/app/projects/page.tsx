'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Github, ExternalLink, Calendar } from 'lucide-react'
import ImageCarousel from '@/components/ImageCarousel'
import ProjectModal from '@/components/ProjectModal'

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  useEffect(() => {
    // Load projects from API
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        } else {
          // Fallback to default projects if API fails
          const defaultProjects: Project[] = [
            {
              id: '1',
              title: 'E-Commerce Platform',
              description: 'A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
              technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL', 'Prisma'],
              githubUrl: 'https://github.com',
              liveUrl: 'https://example.com',
              imageUrls: [
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format&q=80'
              ],
              category: 'Web Development',
              date: '2024-01-15'
            },
            {
              id: '2',
              title: 'Task Management App',
              description: 'A collaborative task management application with real-time updates and team collaboration features.',
              technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'JWT'],
              githubUrl: 'https://github.com',
              liveUrl: 'https://example.com',
              imageUrls: [
                'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&q=80'
              ],
              category: 'Web Development',
              date: '2024-02-20'
            },
            {
              id: '3',
              title: 'Weather Dashboard',
              description: 'A responsive weather dashboard with location-based forecasts and interactive charts.',
              technologies: ['Vue.js', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Vuex'],
              githubUrl: 'https://github.com',
              imageUrls: ['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop'],
              category: 'Web Development',
              date: '2024-03-10'
            },
            {
              id: '4',
              title: 'Mobile Fitness App',
              description: 'A React Native fitness tracking app with workout plans and progress tracking.',
              technologies: ['React Native', 'TypeScript', 'Redux', 'SQLite', 'Firebase'],
              githubUrl: 'https://github.com',
              imageUrls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop'],
              category: 'Mobile Development',
              date: '2024-04-05'
            },
            {
              id: '5',
              title: 'AI Chat Bot',
              description: 'An intelligent chatbot powered by machine learning algorithms with natural language processing.',
              technologies: ['Python', 'TensorFlow', 'Flask', 'NLP', 'Docker', 'Redis'],
              githubUrl: 'https://github.com',
              imageUrls: [
                'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&auto=format&q=80'
              ],
              category: 'AI/ML',
              date: '2024-05-12'
            },
            {
              id: '6',
              title: 'Blockchain Voting System',
              description: 'A secure and transparent voting system built on blockchain technology.',
              technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'MetaMask', 'IPFS'],
              githubUrl: 'https://github.com',
              imageUrls: [
                'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&auto=format&q=80',
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&auto=format&q=80'
              ],
              category: 'Blockchain',
              date: '2024-06-18'
            }
          ]
          setProjects(defaultProjects)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    }
    
    loadProjects()
  }, [])

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 neon-text-green">My Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for development.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-neon overflow-hidden cursor-pointer"
              onClick={() => openModal(project)}
            >
              {/* Project Image */}
              {project.imageUrls && project.imageUrls.length > 0 && (
                <div className="w-full h-64 overflow-hidden relative">
                  <img
                    src={project.imageUrls[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {project.imageUrls.length}
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}