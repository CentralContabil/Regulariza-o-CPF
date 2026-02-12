import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()
    const contents = await prisma.landingPageContent.findMany()
    const contentMap = contents.reduce((acc: Record<string, unknown>, item) => {
      acc[item.section] = item.content
      return acc
    }, {})
    return NextResponse.json(contentMap)
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    console.error('[API /content]', err.message, err.code)
    return NextResponse.json(
      { error: 'Erro de conexão com o banco', details: err.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { section, content } = await request.json()
    const updated = await prisma.landingPageContent.upsert({
      where: { section },
      update: { content },
      create: { section, content },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
