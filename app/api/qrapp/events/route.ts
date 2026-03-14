import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://services.leadconnectorhq.com/products/?locationId=${process.env.NEXT_PUBLIC_GHL_LOCATION_ID}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
          Version: "2021-07-28",
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const raw = await response.json();
    const events = raw.products ?? [];
    const total: number = raw.total ?? events.length;

    // TODO: current implementation fetches first 100 products only.
    // If total > 100, a pagination loop is needed to fetch remaining pages.
    if (total > 100) {
      console.warn(
        `[/api/qrapp/events] GHL reports ${total} total products but only the first 100 were fetched. Future enhancement: implement offset loop.`
      );
    }

    return NextResponse.json({ events, total });
  } catch (error: any) {
    console.error("[/api/qrapp/events] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
