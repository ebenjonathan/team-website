export const businessUnitType = {
  name: 'businessUnit',
  title: 'Business Unit',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'tagline', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'head', type: 'string' },
    { name: 'services', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', type: 'number' },
  ],
}
