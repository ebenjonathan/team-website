import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const tiles = [
  {
    src: '/images/corporate/corp-1.webp',
    alt: 'Leadership team in strategic discussion',
    label: 'Strategic Advisory',
  },
  {
    src: '/images/corporate/corp-2.webp',
    alt: 'Executives in a corporate boardroom',
    label: 'Human Capital',
  },
  {
    src: '/images/corporate/corp-3.webp',
    alt: 'Professionals collaborating',
    label: 'Governance & Risk',
  },
  {
    src: '/images/corporate/corp-4.webp',
    alt: 'Data analytics presentation session',
    label: 'Analytics & Research',
  },
  {
    src: '/images/corporate/corp-5.webp',
    alt: 'Business executives at a summit',
    label: 'Digital Transformation',
  },
]

export function AfricanPresenceSection() {
  return (
    <section className="bg-primary-deeper overflow-hidden">
      <style>{`
        .african-bento-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
          .african-bento-grid {
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: 300px 300px;
          }
          .african-bento-tile-0 { grid-column: 1 / span 5; grid-row: 1 / span 2; }
          .african-bento-tile-1 { grid-column: 6 / span 4; grid-row: 1; }
          .african-bento-tile-2 { grid-column: 10 / span 3; grid-row: 1; }
          .african-bento-tile-3 { grid-column: 6 / span 4; grid-row: 2; }
          .african-bento-tile-4 { grid-column: 10 / span 3; grid-row: 2; }
        }
      `}</style>

      {/* Header */}
      <div className="container mx-auto px-4 py-16 pb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
          Our Footprint
        </p>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
          Working across markets with{' '}
          <span className="text-primary">practical, people-centred insight.</span>
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed">
          Our consulting practice is grounded in local realities and shaped by experience in
          environments where adaptability, trust, and execution matter most.
        </p>
      </div>

      {/* Bento mosaic */}
      <div className="african-bento-grid grid gap-[3px]">
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            className={`african-bento-tile-${i} relative overflow-hidden group ${
              i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
            } md:aspect-auto`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-center gap-2.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <span className="block w-5 h-[2px] bg-primary flex-shrink-0" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  {tile.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Link
          href="/our-markets-clients"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors duration-200"
        >
          Explore our markets &amp; clients
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
