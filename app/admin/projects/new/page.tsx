'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Project form component to create a new project
const NewProject = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Form state - changed default image to GIF
  const [form, setForm] = useState({
    title: '',
    year: new Date().getFullYear(),
    description: '',
    details: '',
    languages: [''],
    githubLink: '',
    liveLink: '',
    image: '/proj1.gif' // Changed to GIF fallback
  })

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      router.push('/admin')
      return
    }
    
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLanguageChange = (index: number, value: string) => {
    const updatedLanguages = [...form.languages]
    updatedLanguages[index] = value
    setForm(prev => ({
      ...prev,
      languages: updatedLanguages
    }))
  }

  const addLanguageField = () => {
    setForm(prev => ({
      ...prev,
      languages: [...prev.languages, '']
    }))
  }

  const removeLanguageField = (index: number) => {
    if (form.languages.length <= 1) return
    
    const updatedLanguages = [...form.languages]
    updatedLanguages.splice(index, 1)
    setForm(prev => ({
      ...prev,
      languages: updatedLanguages
    }))
  }

  // Updated file change handler for GIF support
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type - now includes GIF
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPG, PNG, GIF, or WebP)')
      return
    }

    // Check file size (limit to 10MB for GIFs, 5MB for others)
    const maxSize = file.type === 'image/gif' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File size exceeds ${file.type === 'image/gif' ? '10MB' : '5MB'} limit`)
      return
    }

    setUploadedImage(file)
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    
    // Update form with the preview URL for now
    setForm(prev => ({
      ...prev,
      image: previewUrl
    }))
  }

  const uploadImage = async (): Promise<string> => {
    if (!uploadedImage) return form.image

    setIsUploading(true)
    setUploadProgress(0)

    try {
        const formData = new FormData()
        formData.append('file', uploadedImage)
        
        // Use fetch for Azure upload
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        
        if (data.success) {
            setUploadProgress(100)
            console.log('File uploaded to Azure:', data.imageUrl)
            return data.imageUrl // This will be the Azure blob URL
        } else {
            throw new Error(data.error || 'Upload failed')
        }
    } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image. Please try again.')
        return form.image
    } finally {
        setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // First upload the image if there is one
      let imageUrl = form.image
      if (uploadedImage) {
        imageUrl = await uploadImage()
      }
      
      // Create project using the API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          image: { src: imageUrl } // Properly structure the image data for the API
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/admin/projects')
      } else {
        throw new Error(data.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header/Navigation */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin <span className="text-violet-500">Dashboard</span>
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/admin/projects" className="text-xl font-bold">
              Projects
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-xl font-bold">New Project</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin/projects" className="text-gray-400 hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-gray-400 mb-2">Project Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="year" className="block text-gray-400 mb-2">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  min={2000}
                  max={2100}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-400 mb-2">Description (Short) *</label>
              <input
                type="text"
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="details" className="block text-gray-400 mb-2">Details (Long)</label>
              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Technologies/Languages *</label>
              {form.languages.map((lang, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => handleLanguageChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeLanguageField(index)}
                    className="ml-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    disabled={form.languages.length <= 1}
                  >
                    -
                  </button>
                  {index === form.languages.length - 1 && (
                    <button
                      type="button"
                      onClick={addLanguageField}
                      className="ml-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="githubLink" className="block text-gray-400 mb-2">GitHub Link</label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div>
                <label htmlFor="liveLink" className="block text-gray-400 mb-2">Live Demo Link</label>
                <input
                  type="url"
                  id="liveLink"
                  name="liveLink"
                  value={form.liveLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-400 mb-2">Project Image/GIF</label>
              <div className="flex flex-col space-y-4">
                {/* Hidden file input - updated accept attribute */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.gif"
                  className="hidden"
                />
                
                {/* Image preview or current image - updated for GIF support */}
                <div className="relative h-48 border-2 border-dashed rounded-lg overflow-hidden border-gray-700 hover:border-gray-500 transition-colors">
                  {imagePreview || form.image ? (
                    <div className="relative w-full h-full">
                      {/* Use img tag instead of Next.js Image for GIF support */}
                      <img 
                        src={imagePreview || form.image} 
                        alt="Project thumbnail" 
                        className="w-full h-full object-cover"
                        style={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
                          <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="mt-2 text-sm text-white">{uploadProgress}% Uploaded</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No image selected</p>
                    </div>
                  )}
                </div>
                
                {/* Upload button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload Image/GIF
                </motion.button>
                
                {/* Updated help text */}
                <p className="text-sm text-gray-400">
                  Supports JPG, PNG, GIF, WebP (Max size: 5MB for images, 10MB for GIFs)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/projects"
                className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Create Project'}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default NewProject