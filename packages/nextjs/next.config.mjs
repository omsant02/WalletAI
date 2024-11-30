/** @type {import('next').NextConfig} */
const nextConfig = {
  // Original scaffold-stark settings
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  // Extension specific settings
  ...(process.env.BUILD_TYPE === 'extension' && {
    output: 'export',
    distDir: 'extension-dist',
    images: {
      unoptimized: true,
    },
    // Ensure popup page is built
    trailingSlash: true,
  })
};

export default nextConfig;