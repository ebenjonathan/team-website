import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteBlogPost, updateBlogPost } from '@/lib/server/diagnosticStorage'
import { requireAdminAuth } from '@/lib/server/requireAuth'

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  excerpt: z.string().min(5).optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const patch = patchSchema.parse(body)
    const updated = await updateBlogPost(params.id, patch)
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, post: updated })
  } catch (error) {
    console.error('Blog update error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const deleted = await deleteBlogPost(params.id)
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog delete error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
