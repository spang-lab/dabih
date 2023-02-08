/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  rewrites: () => [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8088/api/v1/:path*',
    },
  ],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
