import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["figma", "skills", "projects", "experiences"].map((directory) => ({
      // Require an asset segment so /projects and /experiences page policies stay framework-owned.
      source: `/${directory}/:asset+`,
      headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
    }));
  },
};

export default nextConfig;
