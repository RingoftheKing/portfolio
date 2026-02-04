import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In development, proxy /api requests to the backend server
    // In production (Docker), nginx handles the proxying
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL || 'http://localhost:3000'}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
