// Customer-facing shop text: ordering steps, payment, delivery, returns and FAQs.
// The returns section is a draft; have it approved before relying on it.

export const orderingSteps = [
  { title: 'Add to cart', body: 'Choose your tools and quantities.' },
  {
    title: 'Request your invoice',
    body: 'Enter your details and delivery address, then click “Get invoice”. Your pro-forma invoice arrives by email straight away, with our bank details.',
  },
  {
    title: 'Pay by bank transfer',
    body: 'Pay into our Zimbabwe account in US dollars or our South African account in rand, using your invoice number as the reference.',
  },
  {
    title: 'Send your proof of payment',
    body: 'Upload it using the link in your invoice email, or reply to that email with it attached.',
  },
  { title: 'Receive your order', body: 'We confirm your payment and deliver within 3 working days.' },
]

export const whichPlaybook = [
  { need: 'Leading the culture as an executive or senior manager', product: 'Culture Leadership Playbook', id: 'culture-leadership-playbook' },
  { need: 'Running monthly team conversations as a Culture Champion', product: 'Culture Champions Playbook', id: 'culture-champions-playbook' },
  { need: 'Running team-building sessions that change behaviour', product: 'Teambuilding Activities Playbook', id: 'teambuilding-playbook' },
  { need: 'Starting honest conversations in any meeting', product: 'TEAM Culture Engine™ Card Deck', id: 'card-deck' },
]

export const policySections: { title: string; points: string[] }[] = [
  {
    title: 'Payment',
    points: [
      'All prices are in US dollars (US$) and include VAT at 15.5%.',
      'We accept payment by bank transfer only, into either our Zimbabwe account (ZB Bank, in US dollars) or our South African account (FNB, in rand).',
      'Your invoice shows the exact amount for each account. The rand amount is worked out at the exchange rate on the day of your invoice and stays fixed until the invoice expires.',
      'Please use your invoice number (for example, TEAM-WEB-0012) as the payment reference so we can match your payment quickly.',
      'Your order is reserved for 7 days. If we have not received payment by then, the invoice expires and you can place a new order at any time.',
      'A tax invoice is issued once your payment has been received. Any bank charges are for the sender’s account.',
    ],
  },
  {
    title: 'Delivery',
    points: [
      'Harare: delivered within 3 working days of payment confirmation.',
      'Collection: collect from TEAM Consulting in Harare once we confirm your order is ready, within 3 working days of payment confirmation.',
      'Working days are Monday to Friday, excluding public holidays.',
      'We email you when your order is on its way or ready to collect.',
      'Outside Harare or in South Africa? Contact us and we will arrange a courier.',
    ],
  },
  {
    title: 'Returns and damaged items',
    points: [
      'If an item arrives damaged or you received the wrong item, tell us within 7 days of delivery, with a photo. We will replace it at no cost.',
      'Because these are working books, we cannot accept returns of items that have been written in.',
      'Unused items in their original condition can be returned within 14 days of delivery for a refund of the item price. Delivery costs are not refunded.',
    ],
  },
]

export const shopFaqs: { q: string; a: string }[] = [
  { q: 'Can I pay by card or mobile money?', a: 'Not at the moment. We accept bank transfer only, in US dollars (Zimbabwe) or rand (South Africa).' },
  {
    q: 'When will my order be delivered?',
    a: 'Within 3 working days after we confirm your payment, in Harare. Your payment confirmation email gives the expected date.',
  },
  {
    q: 'I’ve paid. What now?',
    a: 'Upload your proof of payment using the link in your invoice email, or reply to the email with it attached. We confirm by email once the payment reflects.',
  },
  {
    q: 'Do the playbooks include access to the online Culture Engine platform?',
    a: 'No. Platform access is part of our Culture Champions, Manager’s and Leadership programmes. Contact us to find out more.',
  },
  { q: 'Can I get a quotation for my procurement department?', a: 'Yes. Your pro-forma invoice can be used as a quotation. For larger orders, contact us.' },
  { q: 'Do you offer volume pricing?', a: 'Yes, for 20 or more copies. Contact us with the quantities you need.' },
]
