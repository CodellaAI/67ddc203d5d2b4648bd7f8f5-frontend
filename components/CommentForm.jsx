
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      await onSubmit(content)
      setContent('')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          className="h-8 w-8 rounded-full"
          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
          alt={user?.name}
        />
      </div>
      <div className="min-w-0 flex-1">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 dark:border-gray-700 focus-within:border-primary">
            <textarea
              rows={2}
              name="content"
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full resize-none border-0 border-transparent p-0 pb-2 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm bg-transparent"
              placeholder="Tweet your reply"
              maxLength={280}
            />
          </div>
          
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="btn-primary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Reply'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
