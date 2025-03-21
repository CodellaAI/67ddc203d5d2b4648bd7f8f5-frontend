
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import TweetForm from './TweetForm'
import Tweet from './Tweet'
import { useAuth } from '@/hooks/useAuth'

export default function Feed() {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('forYou')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchTweets = async () => {
      setIsLoading(true)
      try {
        const endpoint = activeTab === 'forYou' 
          ? `${process.env.NEXT_PUBLIC_API_URL}/tweets/timeline` 
          : `${process.env.NEXT_PUBLIC_API_URL}/tweets`
        
        const { data } = await axios.get(endpoint)
        setTweets(data)
      } catch (error) {
        toast.error('Failed to load tweets')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTweets()
  }, [activeTab])

  const handleNewTweet = (newTweet) => {
    setTweets(prev => [newTweet, ...prev])
  }

  const handleTweetUpdate = (updatedTweet) => {
    setTweets(prev => 
      prev.map(tweet => 
        tweet._id === updatedTweet._id ? updatedTweet : tweet
      )
    )
  }

  const handleTweetDelete = (tweetId) => {
    setTweets(prev => prev.filter(tweet => tweet._id !== tweetId))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
              activeTab === 'forYou'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
              activeTab === 'latest'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Latest
          </button>
        </nav>
      </div>
      
      {/* Tweet form */}
      {isAuthenticated && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <TweetForm onTweetSubmit={handleNewTweet} />
        </div>
      )}
      
      {/* Tweets list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : tweets.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tweets.map(tweet => (
            <Tweet 
              key={tweet._id} 
              tweet={tweet} 
              onUpdate={handleTweetUpdate}
              onDelete={handleTweetDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No tweets yet</p>
        </div>
      )}
    </div>
  )
}
