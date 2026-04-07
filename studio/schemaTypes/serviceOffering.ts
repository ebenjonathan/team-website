export const serviceOfferingType = {
  name: 'serviceOffering',
  title: 'Service Offering',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', type: 'text' },
    { name: 'icon', type: 'string' },
    { name: 'features', type: 'array', of: [{ type: 'string' }] },
    { name: 'notableAssignments', type: 'array', of: [{ type: 'string' }] },
    { name: 'businessUnit', type: 'string' },
    { name: 'downloadableProfile', type: 'string' },
    { name: 'order', type: 'number' },
  ],
}
