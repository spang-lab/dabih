import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';

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
  serverRuntimeConfig: {
    MY_VAR: process.env.MY_VAR,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
};
const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    rehypePlugins: [rehypeHighlight],
  },
});
export default withMDX(nextConfig);
