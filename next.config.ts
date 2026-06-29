import type { NextConfig } from "next";
import { createRequire } from "node:module";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

if (process.env.NODE_ENV === "development") {
  try {
    const require = createRequire(import.meta.url);
    const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare") as {
      initOpenNextCloudflareForDev?: () => void;
    };
    initOpenNextCloudflareForDev?.();
  } catch {
    // The Cloudflare adapter is only needed for Worker preview/deploy, not local Next dev.
  }
}

export default nextConfig;
