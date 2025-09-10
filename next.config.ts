import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/shakumak' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shakumak/' : '',
};

export default nextConfig;
