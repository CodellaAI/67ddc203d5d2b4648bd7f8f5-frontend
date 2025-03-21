
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaList, FaUser, FaEllipsisH } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const navigation = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Explore', href: '/explore', icon: FaHashtag },
    { name: 'Notifications', href: '/notifications', icon: FaBell },
    { name: 'Messages', href: '/messages', icon: FaEnvelope },
    { name: 'Bookmarks', href: '/bookmarks', icon: FaBookmark },
    { name: 'Lists', href: '/lists', icon: FaList },
    { name: 'Profile', href: `/profile/${user?.username}`, icon: FaUser },
    { name: 'More', href: '#', icon: FaEllipsisH },
  ]

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/" className="text-primary">
            <FaTwitter className="h-8 w-8" />
          </Link>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <item.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
          >
            <BiLogOut className="mr-4 h-6 w-6" />
            Logout
          </button>
        </nav>
      </div>
      
      {user && (
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <Link href={`/profile/${user.username}`} className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
