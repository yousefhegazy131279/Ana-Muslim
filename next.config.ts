import type { NextConfig } from "next";
const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  outputFileTracingExcludes: {
    "/*": ["./mobile/**/*", "./public/mobile/**/*", "./public/downloads/**/*"],
  },
  async rewrites() {
    return [{ source: "/mobile/", destination: "/mobile/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/mobile/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/mobile/index.html",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
      {
        source: "/downloads/:file*",
        headers: [
          {
            key: "Content-Type",
            value: "application/vnd.android.package-archive",
          },
          { key: "Content-Disposition", value: "attachment" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/prophets/optimized/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
export default config;
