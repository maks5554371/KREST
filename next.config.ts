import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 erlaubt standardmäßig nur [75]; das Hero-Bild nutzt quality={90}.
    qualities: [75, 90],
  },
};

export default nextConfig;
