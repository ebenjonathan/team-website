import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { createAssociate, listAssociates, storageStatus } from '@/lib/server/associatesStore'
import { associateSchema } from './schema'

export const dynamic = 'force-dynamic'

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError
  try {
    return NextResponse.json({ success: true, associates: await listAssociates(), storage: storageStatus() })
  } catch (error) {
    console.error('[Associates] list failed:', error)
    return NextResponse.json({ success: false, message: 'Could not load associates.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth()
  if (authError) return authError
  const parsed = associateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  try {
    const associate = await createAssociate(parsed.data)
    revalidatePath('/why-team/our-team')
    return NextResponse.json({ success: true, associate })
  } catch (error) {
    console.error('[Associates] create failed:', error)
    return NextResponse.json({ success: false, message: 'Could not save. ' + storageStatus().message }, { status: 500 })
  }
}
