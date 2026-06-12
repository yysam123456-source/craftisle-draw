import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

/**
 * Serves the self-contained Excalidraw subset worker bundle.
 *
 * The client fetches this, creates a Blob URL, and passes it to
 * Excalidraw's Worker constructor. This bypasses:
 *   - Cloudflare Bot Fight Mode (which blocks direct .js file access)
 *   - CSP "worker-src blob:" (we serve via API → client creates blob)
 */
export async function GET() {
  try {
    const bundlePath = join(process.cwd(), ".next", "worker-bundle.js")
    const code = await readFile(bundlePath, "utf-8")
    return new NextResponse(code, {
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Worker bundle not found. Run `npm run build` first.", {
      status: 500,
    })
  }
}
