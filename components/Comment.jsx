
import { useState } from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'
import { FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function Comment({ comment }) {
  const [likes, setLikes] = useState(comment.likes?.length || 0)
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(comment.user?._id) || false)
  const { user } = useAuth()
  
  const isOwner = user?._id === comment.user?._id

  const handleLike = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment._id}/like`)
      
      if (isLiked) {
        setLikes(likes - 1)
      } else {
        setLikes(likes + 1)
      }
      
      setIsLiked(!isLiked)
    } catch (error) {
      toast.error('Failed to like comment')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment._id}`)
      toast.success('Comment deleted')
      // You might want to remove the comment from the list
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Link href={`/profile/${comment.user?.username}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=random`}
              alt={comment.user?.name}
            />
          </Link>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/profile/${comment.user?.username}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                {comment.user?.name}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                @{comment.user?.username} · {format(comment.createdAt)}
              </span>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap text-sm">{comment.content}</p>
          
          <div className="mt-2 flex items-center">
            <button 
              onClick={handleLike} 
              className={`flex items-center text-sm ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              {isLiked ? <FaHeart className="mr-1 h-3 w-3" /> : <FaRegHeart className="mr-1 h-3 w-3" />}
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
