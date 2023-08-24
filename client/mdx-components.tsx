// @ts-nocheck

import type { MDXComponents } from 'mdx/types';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.
import components from './mdx';

// This file is required to use MDX in `app` directory.
export function useMDXComponents(builtIn: MDXComponents): MDXComponents {
  return {
    ...builtIn,
    ...components,
  };
}
