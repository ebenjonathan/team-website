import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import type { TeamMember } from '@/types'

interface TeamCardProps {
  member: TeamMember
}

const isPlaceholderImage = (image?: string) =>
  image?.endsWith('/male-profile.png') || image?.endsWith('/female-profile.png')

export function TeamCard({ member }: TeamCardProps) {
  const hideImage = isPlaceholderImage(member.image)

  return (
    <div className="overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
      {!hideImage && (
        <div className="relative h-72 overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 text-center">
        <h3 className="font-bold font-heading text-primary-deeper text-lg">{member.name}</h3>
        <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
        {member.socialLinks?.linkedin && (
          <a
            href={member.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deeper hover:text-primary transition-colors"
          >
            <Linkedin className="w-4 h-4" /> Connect on LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}
