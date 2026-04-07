export const serviceSchema = {
  name: 'service',
  type: 'document',
  title: 'Service',
  fields: [
    { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', type: 'text' },
    { name: 'icon', type: 'string' },
    { name: 'features', type: 'array', of: [{ type: 'string' }] },
    { name: 'notableAssignments', type: 'array', of: [{ type: 'string' }] },
    { name: 'businessUnit', type: 'string' },
    { name: 'downloadableProfile', type: 'url' },
    { name: 'order', type: 'number' },
  ],
}

export const teamMemberSchema = {
  name: 'teamMember',
  type: 'document',
  title: 'Team Member',
  fields: [
    { name: 'name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'role', type: 'string' },
    { name: 'bio', type: 'text' },
    { name: 'yearsConsulting', type: 'number' },
    { name: 'overallExperience', type: 'number' },
    { name: 'qualifications', type: 'array', of: [{ type: 'string' }] },
    { name: 'photo', type: 'image', options: { hotspot: true } },
    {
      name: 'socialLinks',
      type: 'object',
      fields: [
        { name: 'twitter', type: 'url' },
        { name: 'linkedin', type: 'url' },
        { name: 'instagram', type: 'url' },
      ],
    },
    { name: 'order', type: 'number' },
  ],
}

export const caseStudySchema = {
  name: 'caseStudy',
  type: 'document',
  title: 'Case Study',
  fields: [
    { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', type: 'string' },
    { name: 'client', type: 'string' },
    { name: 'duration', type: 'string' },
    { name: 'coverImage', type: 'image', options: { hotspot: true } },
    { name: 'summary', type: 'text' },
    { name: 'challenge', type: 'text' },
    { name: 'approach', type: 'text' },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'metrics',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'string' }] }],
    },
    { name: 'services', type: 'array', of: [{ type: 'string' }] },
    { name: 'publishedAt', type: 'datetime' },
  ],
}

export const eventSchema = {
  name: 'event',
  type: 'document',
  title: 'Event',
  fields: [
    { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'date', type: 'date' },
    { name: 'time', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'category', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'fullDescription', type: 'text' },
    { name: 'isFeatured', type: 'boolean' },
    {
      name: 'agenda',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'time', type: 'string' }, { name: 'title', type: 'string' }] }],
    },
    {
      name: 'speakers',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'title', type: 'string' }, { name: 'company', type: 'string' }] }],
    },
  ],
}

export const partnerSchema = {
  name: 'partner',
  type: 'document',
  title: 'Partner',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string', options: { list: ['technology', 'strategic', 'community'] } },
    { name: 'description', type: 'text' },
    { name: 'website', type: 'url' },
    { name: 'logo', type: 'image', options: { hotspot: true } },
    { name: 'order', type: 'number' },
  ],
}

export const faqSchema = {
  name: 'faqItem',
  type: 'document',
  title: 'FAQ Item',
  fields: [
    { name: 'question', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'answer', type: 'text' },
    { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', type: 'number' },
  ],
}

export const downloadAssetSchema = {
  name: 'downloadAsset',
  type: 'document',
  title: 'Download Asset',
  fields: [
    { name: 'label', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'label' } },
    { name: 'file', type: 'file' },
    { name: 'category', type: 'string' },
  ],
}

export const schemas = [
  serviceSchema,
  teamMemberSchema,
  caseStudySchema,
  eventSchema,
  partnerSchema,
  faqSchema,
  downloadAssetSchema,
]
