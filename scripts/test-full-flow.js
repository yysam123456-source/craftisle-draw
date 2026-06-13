// scripts/test-full-flow.js
// End-to-end test for craftisle-draw (no browser needed)

const BASE = "https://draw.craftisle.com"
const AUTH_COOKIE = "" // Will be set after Google OAuth or session cookie

async function test(name, fn) {
  try {
    const result = await fn()
    console.log(`✅ ${name}`)
    return result
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`)
    return null
  }
}

async function main() {
  console.log("=== Craftisle Draw E2E Test ===\n")

  // Test 1: Homepage loads
  await test("Homepage loads (HTTP 200)", async () => {
    const res = await fetch(`${BASE}/`)
    if (res.status !== 200) throw new Error(`Status: ${res.status}`)
    const text = await res.text()
    if (!text.includes("Craftisle") && !text.includes("My Boards")) {
      throw new Error("Page content missing expected text")
    }
  })

  // Test 2: /test-board loads
  await test("Test board page loads (?test=1)", async () => {
    const res = await fetch(`${BASE}/board/test-e2e?test=1`)
    if (res.status !== 200) throw new Error(`Status: ${res.status}`)
    const text = await res.text()
    // Should contain Excalidraw or the editor wrapper
    if (text.includes("This page couldn't load")) {
      throw new Error("Page failed to load - Server Component crash")
    }
    if (!text.includes("excalidraw") && !text.includes("Editor") && !text.includes("Loading")) {
      console.log("  [warn] Page loaded but may not have Excalidraw. HTML snippet:", text.substring(0, 500))
    }
  })

  // Test 3: API boards endpoint (unauthorized)
  await test("API /api/boards returns 401 when unauthenticated", async () => {
    const res = await fetch(`${BASE}/api/boards`)
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  // Test 4: API worker endpoint
  await test("API /api/excalidraw-worker returns JS", async () => {
    const res = await fetch(`${BASE}/api/excalidraw-worker`)
    if (res.status !== 200) throw new Error(`Status: ${res.status}`)
    const text = await res.text()
    if (!text.includes("Excalidraw") && !text.includes("worker") && !text.includes("self")) {
      throw new Error("Worker response doesn't look like JS")
    }
    console.log(`  [info] Worker JS length: ${text.length}`)
  })

  // Test 5: Check specific board URL that user reported as failing
  await test("User's board URL loads (?debug=1 for error details)", async () => {
    // First try with debug mode to get error info
    const debugUrl = `${BASE}/board/cmqbpy5o80001fvhsag0p3m1?debug=1`
    const res = await fetch(debugUrl)
    const text = await res.text()
    if (text.includes("This page couldn't load")) {
      throw new Error("Page crashed - Server Component error. Check Vercel logs.")
    }
    if (text.includes("Board Load Error") || text.includes("Error:")) {
      // Extract error message
      const match = text.match(/Board Load Error.*?([A-Z].*?)\n/s)
      throw new Error(`Page has error state: ${match?.[1]?.substring(0, 200) || 'Unknown error'}`)
    }
    console.log(`  [info] Status: ${res.status}, Content length: ${text.length}`)
  })

  console.log("\n=== Test Complete ===")
  console.log("If any test failed, check the Vercel deployment logs for the specific error.")
}

main().catch(console.error)
