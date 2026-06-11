// GROQ queries — ready for Sanity CMS integration.
// These mirror the mock data shapes in lib/data/*.

export const SERVICES_QUERY = `
  *[_type in ["serviceOffering", "service"]] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    features,
    notableAssignments,
    businessUnit,
    downloadableProfile,
    price,
    "image": image.asset->url,
  }
`

export const CASE_STUDIES_QUERY = `
  *[_type == "caseStudy"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    client,
    duration,
    "image": coverImage.asset->url,
    summary,
    tags,
    metrics,
    services,
    challenge,
    approach,
    technologies,
  }
`

export const TEAM_QUERY = `
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    yearsConsulting,
    overallExperience,
    qualifications,
    "image": photo.asset->url,
    socialLinks,
  }
`

export const EVENTS_QUERY = `
  *[_type == "event"] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    time,
    location,
    description,
    category,
    isFeatured,
    "image": image.asset->url,
  }
`

export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    role,
    company,
    quote,
    rating,
    "image": photo.asset->url,
  }
`

export const PARTNERS_QUERY = `
  *[_type == "partner"] | order(order asc) {
    _id,
    name,
    description,
    type,
    website,
    "logo": logo.asset->url,
  }
`

export const FAQ_QUERY = `
  *[_type in ["faq", "faqItem"]] | order(order asc) {
    _id,
    question,
    answer,
    category,
    keywords,
  }
`

export const DOWNLOAD_ASSETS_QUERY = `
  *[_type in ["downloadResource", "downloadAsset"]] {
    _id,
    label,
    "slug": slug.current,
    "href": file.asset->url,
    category,
  }
`

export const BUSINESS_UNITS_QUERY = `
  *[_type == "businessUnit"] | order(order asc) {
    _id,
    name,
    tagline,
    "slug": slug.current,
    description,
    services,
    head,
    "image": image.asset->url,
  }
`

export const CLIENTS_QUERY = `
  *[_type == "client"] | order(order asc) {
    _id,
    name,
    website,
    "logo": logo.asset->url,
  }
`

export const GLOBAL_SETTINGS_QUERY = `
  *[_type == "globalSettings"][0] {
    name,
    tagline,
    founded,
    foundedIn,
    overview,
    stats,
    philosophy,
    fourStrands,
    greaterFramework,
    approach,
  }
`

export const CONTACTS_QUERY = `
  *[_type == "countryContact"] {
    country,
    email,
    phone,
    address,
  }
`
