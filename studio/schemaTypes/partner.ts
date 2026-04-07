export const partnerType = {
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'type', type: 'string', options: { list: ['technology', 'strategic', 'community'] } },
    { name: 'website', type: 'url' },
    { name: 'logo', type: 'image', options: { hotspot: true } },
    { name: 'order', type: 'number' },
  ],
}
