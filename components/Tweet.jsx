
import { useState } from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaShare, FaEllipsisH, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function Tweet({ tweet, isDetailView = false, onUpdate, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [likes, setLikes] = useState(tweet.likes?.length || 0)
  const [isLiked, setIsLiked] = useState(tweet.likes?.includes(tweet.user?._id) || false)
  const { user } = useAuth()
  
  const isOwner = user?._id === tweet.user?._id

  const handleLike = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweet._id}/like`)
      
      if (isLiked) {
        setLikes(likes - 1)
      } else {
        setLikes(likes + 1)
      }
      
      setIsLiked(!isLiked)
      
      if (onUpdate) {
        const updatedTweet = { 
          ...tweet, 
          likes: isLiked 
            ? tweet.likes.filter(id => id !== user._id) 
            : [...tweet.likes, user._id]
        }
        onUpdate(updatedTweet)
      }
    } catch (error) {
      toast.error('Failed to like tweet')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tweets/${tweet._id}`)
      toast.success('Tweet deleted')
      if (onDelete) {
        onDelete(tweet._id)
      }
    } catch (error) {
      toast.error('Failed to delete tweet')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`p-4 ${isDetailView ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Link href={`/profile/${tweet.user?.username}`}>
            <img
              className="h-10 w-10 rounded-full"
              src={tweet.user?.profilePicture || `https://ui-avatars.com/api/?name=${tweet.user?.name}&background=random`}
              alt={tweet.user?.name}
            />
          </Link>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/profile/${tweet.user?.username}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                {tweet.user?.name}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                @{tweet.user?.username} · {format(tweet.createdAt)}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaEllipsisH />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  {isOwner && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Link href={`/tweet/${tweet._id}`} className="block">
            <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{tweet.content}</p>
            
            {tweet.image && (
              <div className="mt-2 rounded-2xl overflow-hidden">
                <img
                  src={tweet.image}
                  alt="Tweet image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
          </Link>
          
          <div className="mt-3 flex justify-between max-w-md">
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <FaRegComment className="mr-1" />
              <span>{tweet.comments?.length || 0}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <FaRetweet className="mr-1" />
              <span>0</span>
            </button>
            <button 
              onClick={handleLike} 
              className={`flex items-center ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              {isLiked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
              <span>{likes}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <FaShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
