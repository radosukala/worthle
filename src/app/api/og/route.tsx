import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const percentile = searchParams.get("p") ?? "50";
  const track = searchParams.get("t") ?? "backend";
  const language = searchParams.get("l") ?? "typescript";
  const grid = searchParams.get("g") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          fontFamily: "monospace",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.15em",
            opacity: 0.5,
            marginBottom: 32,
          }}
        >
          worthle.dev
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {percentile}th percentile
        </div>

        <div
          style={{
            fontSize: 24,
            opacity: 0.6,
            letterSpacing: "0.1em",
            marginBottom: 40,
          }}
        >
          {language} · {track}
        </div>

        {grid && (
          <div
            style={{
              fontSize: 32,
              letterSpacing: "0.05em",
            }}
          >
            {grid}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
