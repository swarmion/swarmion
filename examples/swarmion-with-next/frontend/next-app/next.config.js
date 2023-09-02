/** @type {import('next').NextConfig} */

// TODO : add env validation !!!

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.build.json',
  },
};

module.exports = nextConfig;
