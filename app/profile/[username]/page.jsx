
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { format } from 'timeago.js'
import { FaCalendarAlt, FaMapMarkerAlt, FaLink, FaEdit } from 'react-icons/fa'
import Layout from '@/components/Layout'
import Tweet from '@/components/Tweet'
import ProfileEditModal from '@/components/ProfileEditModal'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tweets')
  const [showEditModal, setShowEditModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { user: currentUser } = useAuth()
  
  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`)
        setUser(data)
        setIsFollowing(data.followers.includes(currentUser?._id))
        
        // Fetch user's tweets
        const tweetsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tweets/user/${data._id}`)
        setTweets(tweetsRes.data)
      } catch (error) {
        toast.error('Failed to load profile')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (username) {
      fetchProfile()
    }
  }, [username, currentUser])

  const handleFollow = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/follow`)
      setIsFollowing(!isFollowing)
      setUser(prev => ({
        ...prev,
        followers: isFollowing 
          ? prev.followers.filter(id => id !== currentUser._id)
          : [...prev.followers, currentUser._id]
      }))
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully')
    } catch (error) {
      toast.error('Failed to follow/unfollow user')
    }
  }

  const handleProfileUpdate = (updatedProfile) => {
    setUser({...user, ...updatedProfile})
    setShowEditModal(false)
    toast.success('Profile updated successfully')
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

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Cover photo */}
        <div className="h-48 bg-primary relative">
          {user.coverPhoto && (
            <img 
              src={user.coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Profile info */}
        <div className="relative px-4 py-6">
          {/* Profile picture */}
          <div className="absolute -top-16 left-4 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
            <img 
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt={user.name} 
              className="w-32 h-32 object-cover"
            />
          </div>
          
          {/* Follow/Edit button */}
          <div className="flex justify-end mb-4">
            {isOwnProfile ? (
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-outline flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleFollow}
                className={isFollowing ? "btn-outline" : "btn-primary"}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          
          {/* User info */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
            
            {user.bio && (
              <p className="mt-3 text-gray-800 dark:text-gray-200">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.website && (
                <div className="flex items-center gap-1">
                  <FaLink />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <span>Joined {format(user.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div>
                <span className="font-bold dark:text-white">{user.following.length}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">Following</span>
              </div>
              <div>
                <span className="font-bold dark:text-white">{user.followers.length}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">Followers</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('tweets')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'tweets'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tweets
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'replies'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tweets & Replies
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'media'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'likes'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Likes
            </button>
          </nav>
        </div>
        
        {/* Tweets list */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tweets.length > 0 ? (
            tweets.map(tweet => (
              <Tweet key={tweet._id} tweet={tweet} />
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">No tweets yet</p>
            </div>
          )}
        </div>
      </div>
      
      {showEditModal && (
        <ProfileEditModal 
          user={user} 
          onClose={() => setShowEditModal(false)} 
          onSave={handleProfileUpdate}
        />
      )}
    </Layout>
  )
}
