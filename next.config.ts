import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude node-native canvas since WebPDFLoader handles it natively
  serverExternalPackages: [],
};

export default nextConfig;
