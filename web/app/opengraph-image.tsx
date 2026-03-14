import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "base-fullstack"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>base-fullstack</div>
      <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16 }}>
        Create and share heartfelt letters
      </div>
    </div>,
    { ...size }
  )
}
