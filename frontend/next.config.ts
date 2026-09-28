import type { NextConfig } from "next";

const configuredBackendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

if (process.env.VERCEL && !configuredBackendUrl) {
  throw new Error("BACKEND_URL must be configured in Vercel");
}

const backendUrl = configuredBackendUrl || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
