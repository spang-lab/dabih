import Image from 'next/image';

import Link from './Link';
import { H1, H2, H3 } from './Headers';
import { UnorderedList, OrderedList, ListItem } from './Lists';
import { Code, Pre } from './Code';
import {
  Table, Tr, Td, Th, Thead,
} from './Table';

function Text(props) {
  const { children } = props;
  return (
    <p>
      {children}
    </p>
  );
}

function ResponsiveImage(props) {
  const { alt, src } = props;
  return (
    <span className="relative h-80 p-2 m-2 block">
      <Image
        className="object-contain object-left"
        alt={alt}
        fill
        sizes="100vw"
        src={src}
      />
    </span>
  );
}

const components = {
  img: ResponsiveImage,
  p: Text,
  h1: H1,
  h2: H2,
  h3: H3,
  a: Link,
  code: Code,
  pre: Pre,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  table: Table,
  thead: Thead,
  th: Th,
  tr: Tr,
  td: Td,
};
export default components;
