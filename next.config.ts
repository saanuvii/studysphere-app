import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required so Turbopack does not attempt to statically trace dynamic CommonJS imports in pdf-parse
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
