import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Brandiha — one virage away from your brand!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Plus besoin de sharp ! Encode directement le SVG en base64 Data URI pour Satori
function svgToDataUri(svg: string): string {
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

interface TagItem {
  file: string;
  style: Record<string, string | number>;
}

const tagLayout: TagItem[] = [
  {
    file: "design-tag.svg",
    style: {
      left: "3%",
      top: "2%",
      position: "absolute" as const,
      width: 140,
      height: 148,
      transform: "rotate(-14deg)",
      opacity: 0.47,
    },
  },
  {
    file: "marketing-tag.svg",
    style: {
      right: "3%",
      top: "4%",
      position: "absolute" as const,
      width: 140,
      height: 148,
      transform: "rotate(31deg)",
      opacity: 0.47,
    },
  },
  {
    file: "multimedia-tag.svg",
    style: {
      left: "5%",
      bottom: "5%",
      position: "absolute" as const,
      width: 140,
      height: 148,
      transform: "rotate(-18deg)",
      opacity: 0.47,
    },
  },
  {
    file: "communication-tag.svg",
    style: {
      right: "8%",
      top: "54%",
      position: "absolute" as const,
      width: 140,
      height: 148,
      opacity: 0.47,
    },
  },
];

export default async function Image() {
  const wallBase64 = readFileSync(
    join(process.cwd(), "public", "wall-background.png"),
  ).toString("base64");

  // Logo: white-filled
  let logoSvg = readFileSync(
    join(process.cwd(), "public", "primary-logo.svg"),
    "utf8",
  );
  logoSvg = logoSvg.replace(/fill="#111111"/g, 'fill="#FFFFFF"');
  const logoDataUri = svgToDataUri(logoSvg);

  // Dev tag
  const devSvg = readFileSync(
    join(process.cwd(), "public", "dev-tag.svg"),
    "utf8",
  );
  const devDataUri = svgToDataUri(devSvg);

  // Render each tag from its own SVG file
  const tagsDataUri = tagLayout.map((tag) => {
    const svg = readFileSync(join(process.cwd(), "public", tag.file), "utf8");
    return svgToDataUri(svg);
  });

  const fontBuf = readFileSync(
    join(process.cwd(), "src", "app", "fonts", "SEEKUW.otf"),
  );
  const fontArrayBuffer = fontBuf.buffer.slice(
    fontBuf.byteOffset,
    fontBuf.byteOffset + fontBuf.byteLength,
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundImage: `url(data:image/png;base64,${wallBase64})`,
          backgroundRepeat: "repeat",
          backgroundSize: "360px 256px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {tagLayout.map((tag, i) => (
          <div
            key={tag.file}
            style={{
              ...tag.style,
              backgroundImage: `url(${tagsDataUri[i]})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* Dev tag — bottom center */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "2%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={devDataUri}
            alt=""
            width={100}
            height={51}
            style={{ opacity: 0.15 }}
          />
        </div>

        {/* Logo with black drop shadow */}
        <img
          src={logoDataUri}
          alt="Brandiha"
          width={800}
          height={197}
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.65))",
          }}
        />
        <p
          style={{
            display: "flex",
            fontSize: 38,
            color: "#FFFFFF",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginTop: 40,
            textAlign: "center",
            fontFamily: "SEEKUW",
          }}
        >
          one virage away from your brand !
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "SEEKUW",
          data: fontArrayBuffer,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}