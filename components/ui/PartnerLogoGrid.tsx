'use client'

interface PartnerLogo {
  src: string
  alt: string
}

interface PartnerLogoGridProps {
  logos: PartnerLogo[]
}

export function PartnerLogoGrid({ logos }: PartnerLogoGridProps) {
  if (logos.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex items-center justify-center bg-white rounded-lg border border-slate-100 p-4 h-20"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-12 w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
  )
}
