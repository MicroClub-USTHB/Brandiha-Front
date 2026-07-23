import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Brandiha — one virage away from your brand!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function svgToPng(svg: string, width: number): Promise<string> {
  const sharp = (await import("sharp")).default;
  const buf = await sharp(Buffer.from(svg)).resize(width).png().toBuffer();
  return buf.toString("base64");
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
  const logoBase64 = await svgToPng(logoSvg, 800);

  // Dev tag: pure vector, render with sharp
  const devSvg = readFileSync(
    join(process.cwd(), "public", "dev-tag.svg"),
    "utf8",
  );
  const devBase64 = await svgToPng(devSvg, 100);

  // Render each tag from its own SVG file
  const tagsBase64 = await Promise.all(
    tagLayout.map(async (tag) => {
      const svg = readFileSync(join(process.cwd(), "public", tag.file), "utf8");
      return svgToPng(svg, 200);
    }),
  );

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
              backgroundImage: `url(data:image/png;base64,${tagsBase64[i]})`,
              backgroundSize: "cover",
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
            src={`data:image/png;base64,${devBase64}`}
            alt=""
            width={100}
            height={51}
            style={{ opacity: 0.15 }}
          />
        </div>

        {/* Logo with black drop shadow */}
        <img
          src={`data:image/png;base64,${logoBase64}`}
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
