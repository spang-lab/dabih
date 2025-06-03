import { ReactNode } from "react";

export default function Pluralize({
  children,
  count,
}: {
  children: ReactNode,
  count: number,
}) {
  if (count === 1) {
    return children;
  }
  return <>{children}s</>;
}
