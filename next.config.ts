import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['https://druk-clm.vercel.app/'],
    // Try adding your specific region
    loader: 'default',
  }
};

export default nextConfig;
