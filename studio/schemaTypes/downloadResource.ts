export const downloadResourceType = {
  name: 'downloadResource',
  title: 'Download Resource',
  type: 'document',
  fields: [
    { name: 'label', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'label' } },
    { name: 'resourceType', type: 'string' },
    { name: 'file', type: 'file' },
    { name: 'href', type: 'string' },
  ],
}
