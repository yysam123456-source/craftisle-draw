import { auth } from "@/auth"

export default async function DebugPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const isDebug = sp?.debug === "1"

  let session: any = null
  let sessionError: string | null = null
  try {
    session = await auth()
  } catch (e: any) {
    sessionError = e?.message || String(e)
  }

  return (
    <div style={{ padding: 40, fontFamily: "monospace", fontSize: 13, background: "#1a202c", color: "#68d391", minHeight: "100vh" }}>
      <h1 style={{ color: "#4299e1", fontSize: 18, marginBottom: 20 }}>Debug: /board/new?debug=1</h1>
      <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
        {sessionError && (
          <>
            {"SESSION_ERROR:\n"}
            {sessionError}
            {"\n\n"}
          </>
        )}
        {"SESSION_EXISTS: "}{session ? "YES" : "NO"}\n
        {"USER_EXISTS: "}{session?.user ? "YES" : "NO"}\n
        {"USER_ID: "}{session?.user?.id || "null"}\n
        {"USER_EMAIL: "}{session?.user?.email || "null"}\n
        {"USER_NAME: "}{session?.user?.name || "null"}\n
        {"\nNODE_ENV: "}{process.env.NODE_ENV || "null"}\n
        {"\nFULL_SESSION:\n"}
        {JSON.stringify(session, null, 2)?.substring(0, 3000)}
      </pre>
      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/board/new" style={{ padding: "8px 16px", background: "#4299e1", color: "white", borderRadius: 6, textDecoration: "none" }}>Go to /board/new</a>
        <a href="/api/auth/signin" style={{ padding: "8px 16px", background: "#e2e8f0", color: "#2d3748", borderRadius: 6, textDecoration: "none" }}>Login</a>
      </div>
    </div>
  )
}
