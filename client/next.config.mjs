import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';
import remarkFrontmatter from 'remark-frontmatter';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  rewrites: () => [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:3001/api/v1/:path*',
    },
  ],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx', 'md'],
};
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypeHighlight],
    remarkPlugins: [remarkFrontmatter],
  },
});
export default withMDX(nextConfig);
