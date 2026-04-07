export const globalSettingsType = {
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'tagline', type: 'string' },
    { name: 'founded', type: 'number' },
    { name: 'foundedIn', type: 'string' },
    { name: 'overview', type: 'array', of: [{ type: 'text' }] },
    {
      name: 'stats',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'id', type: 'string' }, { name: 'label', type: 'string' }, { name: 'display', type: 'string' }] }],
    },
    { name: 'philosophy', type: 'text' },
    { name: 'fourStrands', type: 'array', of: [{ type: 'object', fields: [{ name: 'title', type: 'string' }, { name: 'subtitle', type: 'string' }, { name: 'description', type: 'text' }, { name: 'reference', type: 'string' }] }] },
    { name: 'greaterFramework', type: 'array', of: [{ type: 'object', fields: [{ name: 'key', type: 'string' }, { name: 'title', type: 'string' }, { name: 'description', type: 'text' }] }] },
    { name: 'approach', type: 'array', of: [{ type: 'object', fields: [{ name: 'title', type: 'string' }, { name: 'phase', type: 'string' }, { name: 'description', type: 'text' }] }] },
  ],
}
