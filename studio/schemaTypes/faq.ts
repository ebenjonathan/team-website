export const faqType = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', type: 'string' },
    { name: 'answer', type: 'text' },
    { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', type: 'number' },
  ],
}
