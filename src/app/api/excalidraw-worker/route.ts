import { NextResponse } from "next/server"
import { WORKER_BUNDLE_BASE64 } from "@/generated/worker-bundle"

/**
 * Serves the self-contained Excalidraw subset worker bundle.
 * The worker code is embedded at build time via a generated constant,
 * so no runtime filesystem access is needed.
 */
export async function GET() {
  const code = Buffer.from(WORKER_BUNDLE_BASE64, "base64").toString("utf-8")
  return new NextResponse(code, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
