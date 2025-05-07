import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['spida.africa'],
  },
};

export default nextConfig;

// export default withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   ...nextConfig,
// });
