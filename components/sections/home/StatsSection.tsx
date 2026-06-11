import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { target: 20, suffix: '+', label: 'Years in Practice' },
  { target: 13, suffix: '+', label: 'Consultants and Associates' },
  { display: '80%+', label: 'Repeat and Referral Clients' },
  { target: 6, suffix: '+', label: 'Sectors Served' },
] as const

export function StatsSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                {'target' in stat ? (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                ) : (
                  stat.display
                )}
              </div>
              <p className="text-white/70 text-sm uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
