export const teamMemberType = {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'bio', type: 'text' },
    { name: 'yearsConsulting', type: 'number' },
    { name: 'overallExperience', type: 'number' },
    { name: 'qualifications', type: 'array', of: [{ type: 'string' }] },
    { name: 'photo', type: 'image', options: { hotspot: true } },
    { name: 'socialLinks', type: 'object', fields: [{ name: 'twitter', type: 'url' }, { name: 'linkedin', type: 'url' }, { name: 'instagram', type: 'url' }] },
    { name: 'order', type: 'number' },
  ],
}
