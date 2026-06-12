import { NextResponse } from "next/server"
import * as o from "oauth4webapi"
import { encode, decode } from "@auth/core/jwt"

export const dynamic = "force-dynamic"

export async function GET() {
  const result: Record<string, any> = {}

  // Test 1: OIDC discovery
  try {
    const issuer = new URL("https://accounts.google.com")
    const discoveryResponse = await o.discoveryRequest(issuer, {
      [o.allowInsecureRequests]: true,
    })
    const as = await o.processDiscoveryResponse(issuer, discoveryResponse)
    result.disco_ok = true
    result.auth_endpoint = as.authorization_endpoint
  } catch (e: any) {
    result.disco_error = e.message
    return NextResponse.json(result)
  }

  // Test 2: encode/decode (JWT cookie encryption - this is what sealCookie uses)
  try {
    const secret = process.env.AUTH_SECRET!
    result.secret_len = secret.length
    
    // This is what sealCookie does
    const encoded = await encode({
      secret,
      token: { value: "test-state-12345" },
      salt: "next-auth.state",
      maxAge: 60 * 15,
    })
    result.encode_ok = true
    result.encode_preview = encoded.substring(0, 50) + "..."

    // Try decoding it back
    const decoded = await decode({
      secret,
      token: encoded,
      salt: "next-auth.state",
    })
    result.decode_ok = true
    result.decoded_value = decoded?.value
  } catch (e: any) {
    result.encode_error = e.message
    result.encode_error_name = e.constructor?.name
    result.encode_error_stack = e.stack?.split("\n").slice(0, 10).join("\n")
  }

  // Test 3: PKCE functions
  try {
    const verifier = o.generateRandomCodeVerifier()
    const challenge = await o.calculatePKCECodeChallenge(verifier)
    result.pkce_ok = true
    result.verifier_len = verifier.length
    result.challenge_len = challenge.length
  } catch (e: any) {
    result.pkce_error = e.message
  }

  return NextResponse.json(result)
}
