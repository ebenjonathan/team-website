import Image from 'next/image'

const countries = [
  { name: 'Zimbabwe', code: 'zw' },
  { name: 'Zambia', code: 'zm' },
  { name: 'Namibia', code: 'na' },
  { name: 'Botswana', code: 'bw' },
  { name: 'Mozambique', code: 'mz' },
  { name: 'Uganda', code: 'ug' },
  { name: 'Tanzania', code: 'tz' },
  { name: 'Malawi', code: 'mw' },
  { name: 'South Africa', code: 'za' },
  { name: 'Lesotho', code: 'ls' },
  { name: 'Spain', code: 'es' },
]

function FlagItem({ name, code }: { name: string; code: string }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 mx-6">
      <div className="w-16 h-11 rounded overflow-hidden shadow border border-white/10 relative">
        <Image
          src={`https://flagcdn.com/w80/${code}.png`}
          alt={`${name} flag`}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <span className="text-xs text-white/55 font-medium whitespace-nowrap">{name}</span>
    </div>
  )
}

export function CountryPresenceSection() {
  const doubled = [...countries, ...countries]
  return (
    <section className="py-14 bg-primary-deeper overflow-hidden">
      <div className="container mx-auto mb-8 text-center">
        <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold mb-1">
          Geographic Footprint
        </p>
        <h2 className="text-2xl font-bold font-heading text-white">
          A regional footprint with a local lens
        </h2>
      </div>
      <div className="relative">
        <div className="flags-track flex items-end">
          {doubled.map((c, i) => (
            <FlagItem key={`${c.code}-${i}`} name={c.name} code={c.code} />
          ))}
        </div>
      </div>
    </section>
  )
}
