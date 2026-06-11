import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createBlogPost, listBlogPosts } from '@/lib/server/diagnosticStorage'
import { requireAdminAuth } from '@/lib/server/requireAuth'

const blogSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(5),
})

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const posts = await listBlogPosts()
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Blog list error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const data = blogSchema.parse(body)

    const post = {
      id: `blog_${Date.now()}`,
      title: data.title,
      excerpt: data.excerpt,
      createdAt: new Date().toISOString(),
    }

    await createBlogPost(post)
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Blog create error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
