

import { useDraggable } from "@dnd-kit/core";

export default function Draggable({ id, children }
  : { id: string, children: React.ReactNode }) {
  const { attributes, listeners,
    setNodeRef } = useDraggable({ id });


  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

