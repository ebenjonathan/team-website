'use client'

import Image from 'next/image'
import type { ClientLogoGroup } from '@/lib/images'

interface ClientLogoGridProps {
  groups: ClientLogoGroup[]
}

export function ClientLogoGrid({ groups }: ClientLogoGridProps) {
  if (groups.length === 0) return null

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.sector}>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            {group.sector}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {group.logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-white rounded-lg border border-slate-100 p-4 h-20"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={48}
                  loading="lazy"
                  className="h-12 w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
