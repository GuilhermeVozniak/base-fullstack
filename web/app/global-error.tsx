"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Something went wrong</h1>
            <p style={{ marginTop: "1rem", color: "#666" }}>
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#999" }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
