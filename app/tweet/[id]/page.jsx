
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { format } from 'timeago.js'
import { FaArrowLeft } from 'react-icons/fa'
import Layout from '@/components/Layout'
import Tweet from '@/components/Tweet'
import CommentForm from '@/components/CommentForm'
import Comment from '@/components/Comment'
import { useAuth } from '@/hooks/useAuth'

export default function TweetPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tweet, setTweet] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchTweet = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${id}`)
        setTweet(data)
        
        // Fetch comments
        const commentsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${id}/comments`)
        setComments(commentsRes.data)
      } catch (error) {
        toast.error('Failed to load tweet')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchTweet()
    }
  }, [id])

  const handleCommentSubmit = async (content) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${id}/comments`, { content })
      setComments(prev => [data, ...prev])
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const goBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!tweet) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Tweet not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The tweet you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <button onClick={goBack} className="text-gray-600 dark:text-gray-400 hover:text-primary">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold dark:text-white">Tweet</h1>
        </div>
        
        {/* Main tweet */}
        <div className="p-4">
          <Tweet tweet={tweet} isDetailView={true} />
        </div>
        
        {/* Comment form */}
        {isAuthenticated && (
          <div className="p-4 border-t border-b border-gray-200 dark:border-gray-700">
            <CommentForm onSubmit={handleCommentSubmit} />
          </div>
        )}
        
        {/* Comments */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {comments.length > 0 ? (
            comments.map(comment => (
              <Comment key={comment._id} comment={comment} />
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
