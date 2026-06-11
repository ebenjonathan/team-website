'use client'

interface Props { src: string; alt: string }

export function PartnerLogoImg({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="max-h-12 max-w-full object-contain"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}
