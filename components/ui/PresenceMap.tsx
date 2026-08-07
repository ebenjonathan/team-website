import Image from 'next/image'

export function PresenceMap() {
  return (
    <div className="w-full flex justify-center">
      <Image
        src="/images/map.png"
        alt="Geographical presence map"
        width={1600}
        height={900}
        loading="lazy"
        className="w-full max-w-5xl mx-auto h-auto object-contain"
      />
    </div>
  )
}
