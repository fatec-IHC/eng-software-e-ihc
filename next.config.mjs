/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed ignoreBuildErrors - fix TypeScript errors before building
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
