'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    name: "home",
    href: "/"
  },
  {
    name: "layanan",
    href: "/layanan"
  },
  {
    name: "contact",
    href: "/layanan"
  }
]

export function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Menutup popover saat pengguna mengklik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Tombol Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors dark:text-gray-200"
        aria-expanded={isOpen}
      >
        {/* <span>Menu</span> */}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Jendela Kotak Mengambang (Floating Popover) */}
      {isOpen && (
        <div className="absolute right-0 bottom-full z-50 mb-2 w-48 rounded-xl border border-gray-100 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = pathname === item.href

              return (
                <li key={`${item.name}-${index}`}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}