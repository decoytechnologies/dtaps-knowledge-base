/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the correct location for this flag.
  // It tells Next.js to ignore TypeScript errors during the production build.
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;