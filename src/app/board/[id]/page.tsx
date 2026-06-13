import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard } from "@/lib/boards"

export const dynamic = "force-dynamic"

// Test mode: hardcoded test user ID (bypasses Google OAuth)
const TEST_USER_ID = "test-user-0000-0000-0000-000000000001"

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const sp = await searchParams
  const test = sp?.test
  const debug = sp?.debug
  const dev = sp?.dev
  const devt = sp?.devt
  const isTest = test === "1"
  const isDebug = debug === "1" || test === "1"
  // dev mode: skip Google OAuth if devt matches DEV_TEST_TOKEN env var
  const isDev = dev === "1" && devt === process.env.DEV_TEST_TOKEN

  // In test/dev mode, skip auth and use test user
  let userId: string
  let sessionDebug: any = null

  if (isTest || isDev) {
    userId = TEST_USER_ID
  } else {
    let session: any = null
    try {
      session = await auth()
      sessionDebug = {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
        error: null,
      }
    } catch (err: any) {
      sessionDebug = {
        hasSession: false,
        error: String(err),
        message: "Auth check failed",
      }
    }
    const user = session?.user
    if (!user) {
      if (isDebug) {
        // In debug mode, show auth error instead of redirecting
        return (
          <div className="h-screen flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">Auth Debug</h2>
            <pre className="bg-gray-100 p-4 rounded max-w-2xl overflow-auto text-sm">
              {JSON.stringify(sessionDebug, null, 2)}
              {"\n\n"}
              Redirecting to signin would happen here.
              {"\n"}
              Add ?test=1 to bypass auth.
            </pre>
          </div>
        )
      }
      const callbackUrl = encodeURIComponent("/board/" + id)
      return redirect("/api/auth/signin?callbackUrl=" + callbackUrl)
    }
    userId = user!.id!
    sessionDebug.finalUserId = userId
  }

  // Fetch board data with error handling
  let board: any = null
  let boardError: any = null

  try {
    if (isTest) {
      board = {
        id: id,
        elements: [],
        appState: { viewBackgroundColor: "#ffffff" },
        title: "Test Board",
        userId: TEST_USER_ID,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } else {
      board = await getBoard(id, userId)
      if (!board) {
        board = await createBoard(userId)
      }
      if (!board) notFound()
    }
  } catch (err: any) {
    boardError = {
      message: err?.message || String(err),
      stack: err?.stack || null,
    }
  }

  if (boardError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Board Data Error</h2>
        <pre className="bg-gray-100 p-4 rounded max-w-2xl overflow-auto text-sm">
          {JSON.stringify(boardError, null, 2)}
        </pre>
      </div>
    )
  }

  if (isDebug) {
    return (
      <div className="h-screen flex flex-col p-4">
        <h2 className="text-lg font-bold mb-2">Debug Info</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4 text-xs overflow-auto">
          {JSON.stringify({ sessionDebug, boardId: board.id, isTest, isDebug }, null, 2)}
        </pre>
        <div className="flex-1 border">
          <ExcalidrawEditor
            boardId={board.id}
            initialData={{
              elements: board.elements as any[],
              appState: board.appState as any,
            }}
            readOnly={false}
            onSave={isTest ? undefined : async (elements: any[], appState: any) => {
              await fetch(`/api/boards/${board.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ elements, appState }),
              })
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <ExcalidrawEditor
      boardId={board.id}
      initialData={{
        elements: board.elements as any[],
        appState: board.appState as any,
      }}
      readOnly={false}
      onSave={
        isTest
          ? undefined
          : async (elements: any[], appState: any) => {
              await fetch(`/api/boards/${board.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ elements, appState }),
              })
            }
      }
    />
  )
}
