'use client'

import Image from 'next/image'

interface Props { src: string; alt: string }

export function PartnerLogoImg({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={48}
      loading="lazy"
      className="max-h-12 max-w-full object-contain"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}
