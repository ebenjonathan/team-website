import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { deleteAssociate, storageStatus, updateAssociate } from '@/lib/server/associatesStore'
import { associateSchema } from '../schema'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminAuth()
  if (authError) return authError
  const parsed = associateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  try {
    const associate = await updateAssociate(params.id, parsed.data)
    if (!associate) return NextResponse.json({ success: false, message: 'That associate no longer exists.' }, { status: 404 })
    revalidatePath('/why-team/our-team')
    return NextResponse.json({ success: true, associate })
  } catch (error) {
    console.error('[Associates] update failed:', error)
    return NextResponse.json({ success: false, message: 'Could not save. ' + storageStatus().message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminAuth()
  if (authError) return authError
  try {
    const ok = await deleteAssociate(params.id)
    if (!ok) return NextResponse.json({ success: false, message: 'That associate no longer exists.' }, { status: 404 })
    revalidatePath('/why-team/our-team')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Associates] delete failed:', error)
    return NextResponse.json({ success: false, message: 'Could not delete. ' + storageStatus().message }, { status: 500 })
  }
}
