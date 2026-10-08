import { BookOpen, ClipboardList, Stethoscope, Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { teamTools, type ToolCategory } from '@/lib/data/tools'

// Tools come from lib/data/tools.ts, so adding a tool there shows it here too.
const categoryIcon: Record<ToolCategory, typeof BookOpen> = {
  culture: BookOpen,
  engagement: ClipboardList,
  diagnostic: Stethoscope,
}

const tools = [
  ...teamTools.map((t) => ({
    icon: categoryIcon[t.category],
    name: t.name,
    description: t.description,
    status: (t.status === 'live' ? 'live' : 'coming-soon') as 'live' | 'coming-soon' | 'placeholder',
    url: t.status === 'live' ? t.href : undefined,
  })),
  // The "more coming" card only fills a gap while there are fewer than four tools.
  ...(teamTools.length < 4 ? [{
    icon: Plus,
    name: 'More Tools Coming',
    description:
      "We are continuously building new tools to support your team's growth, culture, and performance journey.",
    status: 'placeholder' as const,
    url: undefined as string | undefined,
  }] : []),
]

export function TeamToolsSection() {
  return (
    <section className="py-20 bg-primary-light">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="TEAM Tools"
          title="Purpose-built tools for organisations that must perform with clarity"
          subtitle="A growing suite of practical instruments designed to help teams assess health, align effort, and strengthen the habits that sustain change."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isPlaceholder = tool.status === 'placeholder'

            return (
              <div
                key={tool.name}
                className={`relative rounded-2xl p-6 flex flex-col gap-4 border transition-shadow ${
                  isPlaceholder
                    ? 'border-dashed border-primary/30 bg-white/50'
                    : 'border-primary/10 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isPlaceholder ? 'bg-primary/10' : 'bg-primary-muted'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isPlaceholder ? 'text-primary/40' : 'text-primary'}`} />
                </div>

                <div className="flex-1">
                  <h3
                    className={`font-heading font-semibold text-lg leading-snug mb-2 ${
                      isPlaceholder ? 'text-primary-deeper/50' : 'text-primary-deeper'
                    }`}
                  >
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </a>
                    ) : (
                      tool.name
                    )}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isPlaceholder ? 'text-body/40' : 'text-body'}`}>
                    {tool.description}
                  </p>
                </div>

                {tool.status === 'live' && tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors self-start"
                  >
                    Explore {tool.name} →
                  </a>
                )}

                {tool.status === 'coming-soon' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-muted px-3 py-1 rounded-full self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Coming Soon
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
