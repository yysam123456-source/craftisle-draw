import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard, resolveUserId } from "@/lib/boards"

export const dynamic = "force-dynamic"

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
  const isTest = sp?.test === "1"
  const isDebug = sp?.debug === "1"

  // ---- Auth ----
  let userId: string
  let userInfo: { email?: string; name?: string; image?: string } | undefined

  if (isTest) {
    userId = TEST_USER_ID
  } else {
    let session: any = null
    try {
      session = await auth()
    } catch (authErr: any) {
      console.error("[board] auth() failed:", authErr?.message || authErr)
      // auth() failure — show error instead of crashing
      return (
        <div className="h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <pre className="bg-gray-100 p-4 rounded max-w-2xl overflow-auto text-sm">
            {authErr?.message || String(authErr)}
          </pre>
        </div>
      )
    }
    const user = session?.user
    if (!user) {
      if (isDebug) {
        return <DebugAuthPage id={id} />
      }
      return redirect(
        "/api/auth/signin?callbackUrl=" + encodeURIComponent("/board/" + id)
      )
    }
    userId = user.id!
    userInfo = {}
    if (user.email) userInfo.email = user.email
    if (user.name) userInfo.name = user.name
    if (user.image) userInfo.image = user.image
  }

  // ── Resolve userId to a valid DB user ID (cuid) ──
  // This handles the case where session.user.id is a Google sub
  // but the DB uses cuid format — ensures consistency.
  let resolvedUserId: string
  try {
    resolvedUserId = isTest ? userId : await resolveUserId(userId, userInfo)
  } catch (resolveErr: any) {
    console.error("[board] resolveUserId failed:", resolveErr?.message || resolveErr)
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">User Resolution Error</h2>
        <pre className="bg-gray-100 p-4 rounded max-w-2xl overflow-auto text-sm whitespace-pre-wrap">
          Failed to resolve your user account in the database.
          {"\n\n"}
          {resolveErr?.message || String(resolveErr)}
          {"\n\n"}
          Original User ID: {userId}
        </pre>
        <p className="mt-4 text-sm text-gray-500">
          Try <a href="/api/auth/signout" className="text-blue-600 underline">signing out</a> and back in.
        </p>
      </div>
    )
  }

  // ---- Load board data ----
  let board: any = null
  let boardError: string | null = null

  try {
    if (isTest) {
      // Try DB first (for end-to-end testing with real DB)
      try {
        let b = await getBoard(id, resolvedUserId)
        if (!b) b = await createBoard(resolvedUserId, undefined, userInfo)
        if (!b) throw new Error("createBoard returned null")
        board = b
      } catch (dbErr: any) {
        console.warn("[board/test] DB failed, using mock data:", dbErr?.message || dbErr)
        board = {
          id,
          elements: [],
          appState: { viewBackgroundColor: "#ffffff" },
          title: "Test Board (Mock)",
          userId: TEST_USER_ID,
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    } else {
      // ── Real authenticated user path ──
      if (id === "new") {
        // Create a brand new board and redirect to its URL
        try {
          const newBoard = await createBoard(resolvedUserId, undefined, userInfo)
          if (newBoard?.id) {
            redirect("/board/" + newBoard.id)
          }
          throw new Error("createBoard returned empty result")
        } catch (createErr: any) {
          // Don't swallow NEXT_REDIRECT — re-throw it
          if (createErr?.digest?.startsWith("NEXT_REDIRECT")) {
            throw createErr
          }
          console.error("[board/new] createBoard failed:", createErr?.message || createErr)
          boardError = `Failed to create board: ${createErr?.message || String(createErr)}\n\nResolved User ID: ${resolvedUserId}\nOriginal User ID: ${userId}`
        }
      } else {
        // Existing board — load by ID using RESOLVED user ID
        try {
          board = await getBoard(id, resolvedUserId)
        } catch (getErr: any) {
          console.error("[board] getBoard failed:", getErr?.message || getErr)
          boardError = `Failed to load board "${id}": ${getErr?.message || String(getErr)}\n\nResolved User ID: ${resolvedUserId}\nOriginal User ID: ${userId}`
        }
        if (!board && !boardError) {
          boardError = `Board "${id}" not found or you don't have access.\n\nResolved User ID: ${resolvedUserId}\nOriginal User ID: ${userId}`
        }
      }
    }
  } catch (err: any) {
    // Re-throw Next.js internal errors (redirect, not-found, etc.)
    if (err?.digest?.startsWith("NEXT_")) {
      throw err
    }
    boardError = err?.message || String(err)
  }

  // ---- Error state ----
  if (boardError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Board Load Error</h2>
        <pre className="bg-gray-100 p-4 rounded max-w-2xl overflow-auto text-sm whitespace-pre-wrap">
          {boardError}
        </pre>
        {!isTest && (
          <p className="mt-4 text-sm text-gray-500">
            Tip: Try <a href="/api/auth/signout" className="text-blue-600 underline">signing out</a> and back in to sync your account.
          </p>
        )}
      </div>
    )
  }

  // Safety guard — should never reach here with null board, but just in case
  if (!board) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-yellow-600 mb-4">Unexpected State</h2>
        <p className="text-sm">Board data is empty but no error was raised.</p>
        <p className="text-xs text-gray-400 mt-2">ID: {id} | User: {resolvedUserId}</p>
      </div>
    )
  }

  // ---- Debug panel ----
  if (isDebug) {
    return (
      <div className="h-screen flex flex-col p-4">
        <h2 className="text-lg font-bold mb-2">Debug: {id}</h2>
        <p className="mb-2 text-sm text-gray-600">User: {resolvedUserId} (original: {userId})</p>
        <div className="flex-1 border rounded">
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

  // ---- Normal render ----
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

function DebugAuthPage({ id }: { id: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-bold text-red-600 mb-4">Not Authenticated</h2>
      <p>Add <code>?test=1</code> to the URL to bypass auth.</p>
      <p className="mt-2 text-sm text-gray-500">Board ID: {id}</p>
    </div>
  )
}
