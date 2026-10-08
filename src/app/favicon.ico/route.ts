const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="8" x2="56" y1="8" y2="56" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ff8fb3"/>
      <stop offset="0.55" stop-color="#f7c66d"/>
      <stop offset="1" stop-color="#7dd3fc"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="#1f1633"/>
  <circle cx="32" cy="32" r="24" fill="url(#bg)"/>
  <path d="M18 42V20h6v17h10v5H18Zm21 0V20h9c6 0 10 3 10 8s-4 8-10 8h-3v6h-6Zm6-11h3c3 0 4-1 4-3s-1-3-4-3h-3v6Z" fill="#fffaf0"/>
</svg>
`.trim();

export const dynamic = "force-static";

export function GET() {
  return new Response(svg, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
