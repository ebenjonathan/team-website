'use client'

import Image from 'next/image'
import type { ClientLogoGroup } from '@/lib/images'

interface ClientLogoGridProps {
  groups: ClientLogoGroup[]
}

export function ClientLogoGrid({ groups }: ClientLogoGridProps) {
  if (groups.length === 0) return null

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.sector} className="grid md:grid-cols-12 gap-6 border-t border-gray-300 pt-6">
          <h3 className="md:col-span-3 font-heading font-bold text-lg text-primary-deeper">{group.sector}</h3>
          <ul className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
            {group.logos.map((logo) => (
              <li key={logo.src} className="flex items-center h-16">
                <Image
                  src={encodeURI(logo.src)}
                  alt={logo.alt}
                  width={160}
                  height={56}
                  loading="lazy"
                  className="h-12 w-full object-contain object-left grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
