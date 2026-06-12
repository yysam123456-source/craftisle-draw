import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { createBoard } from "@/lib/boards"

export async function GET(request: Request) {
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed
  }
  if (!session?.user?.id) {
    const url = new URL(request.url)
    const signInUrl = new URL("/api/auth/signin", url.origin)
    signInUrl.searchParams.set("callbackUrl", url.href)
    return NextResponse.redirect(signInUrl)
  }

  const board = await createBoard(session.user.id)
  const url = new URL(request.url)
  return NextResponse.redirect(new URL(`/board/${board.id}`, url.origin))
}
