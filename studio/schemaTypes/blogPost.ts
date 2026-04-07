export const blogPostType = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'category', type: 'reference', to: [{ type: 'blogCategory' }] },
    { name: 'resource', type: 'file' },
    { name: 'publishedAt', type: 'datetime' },
  ],
}
