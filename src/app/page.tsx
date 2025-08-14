'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
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

export default function Home() {
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
          // No fallback projects - only show actual projects from database
          setProjects([])
        }
      } catch (error) {
        console.error('Error loading projects:', error)
        // No fallback projects - only show actual projects from database
        setProjects([])
      }
    }
    
    loadProjects()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-surface dark:from-surface-dark to-white dark:to-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold mb-6"
              >
                Hi, I&apos;m{' '}
                <span className="neon-text">Abdulkareem .O</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                Full Stack Developer passionate about creating beautiful, functional, and user-centered digital experiences.
              </motion.p>
              
              {/* Floating Profile Image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex justify-center mb-12"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 15,
                      z: 50
                    }}
                    className="w-72 h-80 lg:w-80 lg:h-96 bg-black rounded-3xl shadow-2xl border-4 border-primary overflow-hidden relative group transform-gpu perspective-1000"
                    style={{
                      boxShadow: '0 0 20px rgba(194, 63, 27, 0.6), 0 0 40px rgba(194, 63, 27, 0.4), 0 0 60px rgba(194, 63, 27, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    {/* Floating glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Profile Image */}
                    <div className="w-full h-full overflow-hidden">
                      <Image 
                        src="/assets/profile-pic.png" 
                        alt="Profile Picture" 
                        width={400}
                        height={400}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    

                    
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none" />
                  </motion.div>
                  
                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl opacity-20 shadow-lg"
                  />
                  <motion.div
                    animate={{ 
                      rotate: -360,
                      y: [0, 8, 0]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full opacity-20 shadow-lg"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 15, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg opacity-15 shadow-md"
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="#projects" className="btn-neon inline-flex items-center gap-2">
                  View My Work
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-neon">
                  Get In Touch
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-padding bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold mb-12 neon-text-pink"
          >
            Tech Stack
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
          >
            {[
              { name: 'React', iconPath: '/assets/icons8-react-js.svg' },
              { name: 'Next.js', iconPath: '/assets/icons8-next.js.svg' },
              { name: 'TypeScript', iconPath: '/assets/icons8-typescript.svg' },
              { name: 'Node.js', iconPath: '/assets/icons8-nodejs.svg' },
              { name: 'Python', iconPath: '/assets/icons8-python.svg' },
              { name: 'PostgreSQL', iconPath: '/assets/icons8-postgresql.svg' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="p-6 bg-surface dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 mx-auto">
                  <Image 
                    src={tech.iconPath} 
                    alt={`${tech.name} logo`} 
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{tech.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className="section-padding bg-gradient-to-br from-surface dark:from-surface-dark to-white dark:to-background-dark">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 neon-text-green">Featured Projects</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Here are some of my recent projects that showcase my skills and passion for development.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="card-neon overflow-hidden cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    {project.imageUrls && project.imageUrls.length > 0 ? (
                      <>
                        <Image 
                          src={project.imageUrls[0]} 
                          alt={project.title}
                          width={400}
                          height={256}
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
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Project Image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}