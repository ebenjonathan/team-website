# Local Sanity Studio Setup

This project is prepared for offline-first frontend development with fallback content.

## When Network Is Available

Run the following from the project root:

```bash
npm --prefix studio install
npm run studio:dev
npm run studio:seed
```

## Notes

- The Next.js site is configured to render with fallback content when Sanity is unavailable.
- Seed data is sourced from the master brief mapping in `lib/data/masterBrief.ts`.
- Studio schemas include: globalSettings, page, serviceOffering, businessUnit, blogPost, blogCategory, caseStudy, teamMember, partner, client, event, faq, countryContact, downloadResource.
