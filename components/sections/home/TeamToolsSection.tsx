import { BookOpen, ClipboardList, Stethoscope, Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const tools = [
  {
    icon: BookOpen,
    name: 'TEAM Culture Storybook',
    description:
      "Capture and share your organisation's culture narrative — values, rituals, and the stories that define who you are.",
    status: 'live' as const,
    url: 'https://team-storybook.vercel.app/',
  },
  {
    icon: ClipboardList,
    name: 'TEAM Surveys',
    description:
      'Pulse checks and diagnostic surveys designed to surface real insights on engagement, alignment, and team health.',
    status: 'coming-soon' as const,
  },
  {
    icon: Stethoscope,
    name: 'TEAM Greater Diagnosis Tool',
    description:
      'A comprehensive organisational health assessment that pinpoints gaps and charts a clear path to high performance.',
    status: 'coming-soon' as const,
  },
  {
    icon: Plus,
    name: 'More Tools Coming',
    description:
      "We are continuously building new tools to support your team's growth, culture, and performance journey.",
    status: 'placeholder' as const,
  },
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
                        rel="noreferrer"
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

                {!isPlaceholder && (
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
