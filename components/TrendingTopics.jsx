
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaEllipsisH } from 'react-icons/fa'

export default function TrendingTopics() {
  // In a real app, you would fetch trending topics from the backend
  const trends = [
    { id: 1, name: '#JavaScript', tweets: '125K' },
    { id: 2, name: '#ReactJS', tweets: '98K' },
    { id: 3, name: '#NextJS', tweets: '56K' },
    { id: 4, name: '#TailwindCSS', tweets: '45K' },
    { id: 5, name: '#WebDevelopment', tweets: '33K' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold dark:text-white">Trends for you</h2>
      </div>
      
      <div>
        {trends.map(trend => (
          <div 
            key={trend.id} 
            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trending</p>
                <h3 className="font-bold dark:text-white">{trend.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{trend.tweets} Tweets</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FaEllipsisH />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 text-primary hover:bg-gray-50 dark:hover:bg-gray-700">
        <Link href="/explore" className="hover:underline text-sm">
          Show more
        </Link>
      </div>
    </div>
  )
}
