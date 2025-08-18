import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "staticmap.openstreetmap.de" },
    ],
  },
};

export default nextConfig;
