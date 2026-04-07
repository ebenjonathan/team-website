export const clientType = {
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'website', type: 'url' },
    { name: 'logo', type: 'image', options: { hotspot: true } },
    { name: 'category', type: 'string' },
    { name: 'order', type: 'number' },
  ],
}
