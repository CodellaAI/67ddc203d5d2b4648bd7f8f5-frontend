
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function WhoToFollow() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/suggestions`)
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch user suggestions', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  const handleFollow = async (userId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`)
      setUsers(users.filter(user => user._id !== userId))
      toast.success('User followed!')
    } catch (error) {
      toast.error('Failed to follow user')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Who to follow</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-bold mb-4 dark:text-white">Who to follow</h2>
      <div className="space-y-4">
        {users.slice(0, 3).map(user => (
          <div key={user._id} className="flex items-center space-x-3">
            <Link href={`/profile/${user.username}`}>
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={user.name}
                className="h-10 w-10 rounded-full"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${user.username}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                {user.name}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className="bg-black dark:bg-white text-white dark:text-black font-bold py-1 px-4 text-sm rounded-full hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
      <Link href="/explore/people" className="block text-primary hover:underline text-sm mt-4">
        Show more
      </Link>
    </div>
  )
}
