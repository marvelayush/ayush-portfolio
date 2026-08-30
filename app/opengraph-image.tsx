import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ayush Narayan — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0607",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ff2e43",
            fontSize: 26,
            letterSpacing: 4,
          }}
        >
          AYUSH NARAYAN
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: "#ededed",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Software Engineer
          </div>
          <div style={{ display: "flex", color: "#8a8a90", fontSize: 30 }}>
            Backend &amp; Applied AI · Full-Stack Development
          </div>
          <div style={{ display: "flex", color: "#8a8a90", fontSize: 24 }}>
            B.E. Information Science &amp; Engineering @ BMSCE · Class of 2027
          </div>
        </div>
        <div style={{ display: "flex", color: "#8a8a90", fontSize: 24 }}>
          github.com/marvelayush
        </div>
      </div>
    ),
    { ...size },
  );
}
