import { enquiryTopicLabel } from '@/lib/data/enquiry'

export type FormSubmitFailureReason = 'rate' | 'activation' | 'delivery'

export interface ContactSubmissionData {
  name: string
  email: string
  phone?: string
  organisation: string
  country: string
  requestType: string
  message: string
  website?: string
}

export type FormSubmitResult =
  | { success: true }
  | { success: false; reason: FormSubmitFailureReason }

export async function submitContactWithFormSubmit(
  data: ContactSubmissionData,
  fetcher: typeof fetch = fetch,
): Promise<FormSubmitResult> {
  const topic = enquiryTopicLabel(data.requestType)
  const response = await fetcher('https://formsubmit.co/ajax/info@team.co.zw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      _replyto: data.email,
      phone: data.phone ?? '',
      organisation: data.organisation,
      country: data.country,
      service_of_interest: topic,
      message: data.message,
      _subject: `New enquiry (${topic}) from ${data.name}`,
      _honey: data.website ?? '',
    }),
  })

  const result = await response.json().catch(() => null)
  if (response.status === 429) return { success: false, reason: 'rate' }

  const providerAccepted = result?.success === true || result?.success === 'true'
  if (response.ok && providerAccepted) return { success: true }

  const providerMessage = typeof result?.message === 'string' ? result.message : ''
  if (/activat|confirm|verif/i.test(providerMessage)) {
    return { success: false, reason: 'activation' }
  }

  return { success: false, reason: 'delivery' }
}