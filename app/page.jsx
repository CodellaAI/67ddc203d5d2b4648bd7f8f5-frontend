
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/Layout'
import Feed from '@/components/Feed'
import WhoToFollow from '@/components/WhoToFollow'
import TrendingTopics from '@/components/TrendingTopics'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Feed />
        </div>
        <div className="hidden md:block space-y-6">
          <TrendingTopics />
          <WhoToFollow />
        </div>
      </div>
    </Layout>
  )
}
