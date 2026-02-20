import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Only accept the exact fields we expect — nothing else
    const { track, experience, location, sentiment } = body;

    if (!track || !experience || !location || !sentiment) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Log it — Vercel captures this in function logs
    // No IP, no user agent, no session, no fingerprint
    console.log(
      JSON.stringify({
        type: "sentiment",
        track,
        experience,
        location,
        sentiment,
        ts: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
