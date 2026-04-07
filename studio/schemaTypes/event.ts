export const eventType = {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'date', type: 'date' },
    { name: 'time', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'fullDescription', type: 'text' },
    { name: 'category', type: 'string' },
    { name: 'isFeatured', type: 'boolean' },
    { name: 'agenda', type: 'array', of: [{ type: 'object', fields: [{ name: 'time', type: 'string' }, { name: 'title', type: 'string' }] }] },
    { name: 'speakers', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'title', type: 'string' }, { name: 'company', type: 'string' }] }] },
  ],
}
