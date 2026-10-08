import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { MAX_PHOTO_BYTES, PHOTO_TYPES, savePhoto, storageStatus } from '@/lib/server/associatesStore'

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  const form = await request.formData().catch(() => null)
  const file = form?.get('photo')
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'Choose a photo to upload.' }, { status: 400 })
  }
  if (!PHOTO_TYPES[file.type]) {
    return NextResponse.json({ success: false, message: 'Use a JPG, PNG or WebP photo.' }, { status: 400 })
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ success: false, message: 'Use a photo smaller than 3 MB.' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  // Check the file really is the image type it claims to be.
  const sig = bytes.subarray(0, 12).toString('hex')
  const isJpeg = sig.startsWith('ffd8ff')
  const isPng = sig.startsWith('89504e47')
  const isWebp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
  if (!isJpeg && !isPng && !isWebp) {
    return NextResponse.json({ success: false, message: 'That file is not a valid image.' }, { status: 400 })
  }

  try {
    const saved = await savePhoto(bytes, file.type, file.name)
    return NextResponse.json({ success: true, ...saved })
  } catch (error) {
    console.error('[Associates] photo upload failed:', error)
    return NextResponse.json({ success: false, message: 'Could not save the photo. ' + storageStatus().message }, { status: 500 })
  }
}
