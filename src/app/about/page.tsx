'use client'

import { motion } from 'framer-motion'
import { Download, Award, Code, Coffee, Users, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function About() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isLoadingResume, setIsLoadingResume] = useState(false)

  // Load resume URL on component mount
  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch('/api/resume')
        if (response.ok) {
          const data = await response.json()
          setResumeUrl(data.url)
        }
      } catch (error) {
        console.log('No resume found')
      }
    }
    loadResume()
  }, [])

  const handleDownloadResume = async () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    } else {
      setIsLoadingResume(true)
      try {
        const response = await fetch('/api/resume')
        if (response.ok) {
          const data = await response.json()
          setResumeUrl(data.url)
          window.open(data.url, '_blank')
        } else {
          alert('Resume not available at the moment')
        }
      } catch (error) {
        alert('Failed to download resume')
      } finally {
        setIsLoadingResume(false)
      }
    }
  }
  const skills = [
    { 
      category: 'Frontend', 
      technologies: [
        { name: 'React', proficiency: 90 },
        { name: 'Next.js', proficiency: 85 },
        { name: 'TypeScript', proficiency: 80 },
        { name: 'Tailwind CSS', proficiency: 95 },
        { name: 'Vue.js', proficiency: 70 },
        { name: 'Angular', proficiency: 65 }
      ]
    },
    { 
      category: 'Backend', 
      technologies: [
        { name: 'Node.js', proficiency: 85 },
        { name: 'Python', proficiency: 80 },
        { name: 'Express', proficiency: 85 },
        { name: 'Django', proficiency: 75 },
        { name: 'PostgreSQL', proficiency: 80 },
        { name: 'MongoDB', proficiency: 75 }
      ]
    },
    { 
      category: 'Tools & Others', 
      technologies: [
        { name: 'Git', proficiency: 90 },
        { name: 'Docker', proficiency: 70 },
        { name: 'AWS', proficiency: 65 },
        { name: 'Figma', proficiency: 80 },
        { name: 'Jest', proficiency: 75 },
        { name: 'GraphQL', proficiency: 70 }
      ]
    }
  ]

  const stats = [
    { icon: Code, label: 'Projects Completed', value: '50+' },
    { icon: Coffee, label: 'Cups of Coffee', value: '1000+' },
    { icon: Users, label: 'Happy Clients', value: '25+' },
    { icon: Award, label: 'Years Experience', value: '3+' }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Senior Full Stack Developer',
      company: 'Zybra Finance',
      description: 'Leading development of scalable web applications and mentoring junior developers.'
    },
    {
      year: '2023',
      title: 'Full Stack Developer',
      company: 'Upwork',
      description: 'Built and maintained multiple client projects using modern web technologies.'
    },
    {
      year: '2022',
      title: 'Frontend Developer',
      company: 'Fiverr',
      description: 'Specialized in creating responsive and interactive user interfaces.'
    },
    {
      year: '2021',
      title: 'Computer Science Graduate',
      company: 'Federal University of Technology Akure',
      description: 'Graduated with honors, specializing in software engineering and web development.'
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-surface to-white dark:from-background-dark dark:to-surface-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-start"
            >
              <motion.img
                 src="/assets/profile-pic.png"
                 alt="Profile"
                 className="w-80 h-80 shadow-2xl drop-shadow-2xl rounded-2xl filter transform hover:scale-105 transition-transform duration-300 object-contain border-4 border-primary shadow-primary/50"
                 whileHover={{ y: -10 }}
                 style={{
                   filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))',
                   boxShadow: '0 0 20px rgba(194, 63, 27, 0.6), 0 0 40px rgba(194, 63, 27, 0.4), 0 0 60px rgba(194, 63, 27, 0.2)'
                 }}
               />
            </motion.div>
            
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">About Me</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                I'm a passionate full-stack developer with a love for creating beautiful, 
                functional, and user-centered digital experiences. With over 3 years of 
                experience in web development, I specialize in modern JavaScript frameworks 
                and have a keen eye for design.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open-source projects, or enjoying a good cup of coffee 
                while reading about the latest trends in web development.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadResume}
                disabled={isLoadingResume || !resumeUrl}
                className={`btn-neon flex items-center gap-2 mx-auto lg:mx-0 ${
                  !resumeUrl ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isLoadingResume ? 'opacity-75' : ''
                }`}
              >
                {isLoadingResume ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isLoadingResume ? 'Loading...' : resumeUrl ? 'Download Resume' : 'Resume Unavailable'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-surface dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="neon-text-pink">Skills</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold mb-6 text-center">{skillGroup.category}</h3>
                <div className="space-y-4">
                  {skillGroup.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (index * 0.2) + (techIndex * 0.1) }}
                      viewport={{ once: true }}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tech.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tech.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.proficiency}%` }}
                          transition={{ duration: 1.5, delay: (index * 0.2) + (techIndex * 0.1) + 0.5 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A timeline of my professional growth and achievements
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 dark:bg-primary/30 hidden lg:block" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 lg:text-right lg:pr-8">
                    <div className={`card p-6 ${index % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                      <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <div className="text-primary font-medium mb-3">{item.company}</div>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10 hidden lg:block" />
                  
                  <div className="flex-1 lg:pl-8">
                    {/* Empty space for alternating layout */}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl mb-8 opacity-90">
              I'm always interested in hearing about new opportunities and exciting projects.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white dark:bg-surface-dark text-primary dark:text-neon-cyan px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}