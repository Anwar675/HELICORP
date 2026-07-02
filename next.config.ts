import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 78],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "cdn-images.vtv.vn",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "fado.vn",
      },
    ],
  },
};

export default nextConfig;
