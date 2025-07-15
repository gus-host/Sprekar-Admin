import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // ← Add this block:
  async headers() {
    return [
      {
        // apply to all routes; scope down if you only want it on /auth or specific pages
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            // allow pop-ups to remain in the same browsing context group
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            // restore default embedder policy so the Google popup can communicate
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
  env: {
    VISITOR_ACCESS_TOKEN: process.env.VISITOR_ACCESS_TOKEN,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_APP_ENV: process.env.NEXT_APP_ENV,
    PRICEID: process.env.PRICEID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
