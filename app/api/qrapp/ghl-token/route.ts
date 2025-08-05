// app/api/qrapp/ghl-token/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Set cache control headers to prevent caching
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');

  try {
    // Return the token and location ID from environment variables
    return new NextResponse(JSON.stringify({
      token: process.env.GHL_ACCESS_TOKEN,
      locationId: process.env.NEXT_PUBLIC_GHL_LOCATION_ID
    }), {
      status: 200,
      headers: headers,
    });
  } catch (error: any) {
    console.error("[/api/qrapp/ghl-token] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}