import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Brandiha — one virage away from your brand!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const wallBg = readFileSync(
    join(process.cwd(), "public", "wall-background.png"),
  );
  const wallBase64 = wallBg.toString("base64");

  const sharp = (await import("sharp")).default;
  let logoSvg = readFileSync(
    join(process.cwd(), "public", "primary-logo.svg"),
    "utf8",
  );
  logoSvg = logoSvg.replace(/fill="#111111"/g, 'fill="#FFFFFF"');
  const logoPng = await sharp(Buffer.from(logoSvg)).resize(800).png().toBuffer();
  const logoBase64 = logoPng.toString("base64");

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
        }}
      >
        <img
          src={`data:image/png;base64,${logoBase64}`}
          alt="Brandiha"
          width={800}
          height={197}
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
