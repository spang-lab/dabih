
export default function ListItem({
  label, hidden, children,
}: {
  label: string,
  hidden?: boolean,
  children: React.ReactNode,
}) {
  if (hidden) {
    return null;
  }
  return (
    <div className="grid gap-4 grid-cols-3 py-2">
      <dt
        className="text-sm font-medium leading-6"
      >{label}</dt>
      <dd className="col-span-2 leading-6">
        {children}
      </dd>
    </div>
  )
}
