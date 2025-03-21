
import { Fragment } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaList, FaUser, FaEllipsisH } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { useAuth } from '@/hooks/useAuth'

export default function MobileNav({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth()

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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </Transition.Child>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <FaTwitter className="h-8 w-8 text-primary" />
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-primary" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  <BiLogOut className="mr-4 h-6 w-6" />
                  Logout
                </button>
              </nav>
            </div>
            {user && (
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <Link href={`/profile/${user.username}`} className="flex-shrink-0 group block w-full" onClick={() => setIsOpen(false)}>
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
        </Transition.Child>
        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
      </Dialog>
    </Transition.Root>
  )
}
