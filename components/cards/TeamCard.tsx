import Image from 'next/image'
import { Twitter, Instagram, Linkedin } from 'lucide-react'
import type { TeamMember } from '@/types'

interface TeamCardProps {
  member: TeamMember
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deeper/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 pb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-2.5 h-2.5" />
            </a>
          )}
          {member.socialLinks.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-bold font-heading text-primary-deeper text-lg">{member.name}</h3>
        <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
      </div>
    </div>
  )
}
