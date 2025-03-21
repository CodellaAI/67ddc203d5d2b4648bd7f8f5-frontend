
import { useState, useRef } from 'react'
import { FaImage, FaSmile } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function TweetForm({ onTweetSubmit }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  
  const handleImageClick = () => {
    fileInputRef.current.click()
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const removeImage = () => {
    setImage(null)
    setImagePreview('')
    fileInputRef.current.value = ''
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim() && !image) {
      return toast.error('Tweet cannot be empty')
    }
    
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('content', content)
      if (image) {
        formData.append('image', image)
      }
      
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      onTweetSubmit(data)
      setContent('')
      setImage(null)
      setImagePreview('')
      toast.success('Tweet posted!')
    } catch (error) {
      toast.error('Failed to post tweet')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full"
          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
          alt={user?.name}
        />
      </div>
      <div className="min-w-0 flex-1">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 dark:border-gray-700 focus-within:border-primary">
            <textarea
              rows={3}
              name="content"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full resize-none border-0 border-transparent p-0 pb-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm bg-transparent"
              placeholder="What's happening?"
              maxLength={280}
            />
          </div>
          
          {imagePreview && (
            <div className="mt-3 relative">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Tweet image preview"
                  className="w-full h-auto max-h-80 object-contain"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleImageClick}
                className="text-primary hover:text-blue-600"
              >
                <FaImage className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                className="text-primary hover:text-blue-600"
              >
                <FaSmile className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {content.length > 0 && (
                <div className={`text-sm ${content.length > 260 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {280 - content.length}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading || (!content.trim() && !image)}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Tweet'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
