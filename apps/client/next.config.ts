import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  // for local dev. TODO: check if nginx would rewrite before hitting the nextjs server in production, if so we can remove this
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*", // Express server
      },
    ];
  },
};

export default nextConfig;
