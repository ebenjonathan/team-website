export const pageType = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'metaTitle', type: 'string' },
    { name: 'metaDescription', type: 'text' },
    { name: 'heroTitle', type: 'string' },
    { name: 'heroSubtitle', type: 'text' },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ],
}
