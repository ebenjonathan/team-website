// Topics offered in the enquiry form. Links anywhere on the site can pre-select
// one with enquiryHref('coaching'), which opens /contact-us?topic=coaching#enquiry.

export const enquiryTopics = [
  { value: 'general', label: 'General enquiry' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'governance', label: 'Governance & policy' },
  { value: 'operations', label: 'Operations' },
  { value: 'implementation', label: 'Implementation support' },
  { value: 'research', label: 'Analytics & research' },
  { value: 'culture', label: 'Organisation & culture' },
  { value: 'team-building', label: 'Team building' },
  { value: 'ldp', label: 'Leadership Development Programme' },
  { value: 'mdp', label: 'Management Development Programme' },
  { value: 'coaching', label: 'Wellness & coaching' },
  { value: 'diagnostic', label: 'GREATER Diagnostic' },
  { value: 'tools', label: 'TEAM tools' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'careers', label: 'Careers' },
] as const

export type EnquiryTopic = (typeof enquiryTopics)[number]['value']

export const enquiryTopicValues = enquiryTopics.map((t) => t.value) as [EnquiryTopic, ...EnquiryTopic[]]

export function isEnquiryTopic(value: unknown): value is EnquiryTopic {
  return typeof value === 'string' && (enquiryTopicValues as string[]).includes(value)
}

export function enquiryTopicLabel(value: string) {
  return enquiryTopics.find((t) => t.value === value)?.label ?? value
}

export function enquiryHref(topic: EnquiryTopic = 'general') {
  return topic === 'general' ? '/contact-us#enquiry' : `/contact-us?topic=${topic}#enquiry`
}

/** Maps a service slug to its enquiry topic. */
export const serviceTopic: Record<string, EnquiryTopic> = {
  'strategy-design': 'strategy',
  'governance-policy': 'governance',
  operations: 'operations',
  implementation: 'implementation',
  'analytics-research': 'research',
  'organisation-culture': 'culture',
  'wellness-coaching': 'coaching',
}
