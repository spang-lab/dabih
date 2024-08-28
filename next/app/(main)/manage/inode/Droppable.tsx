
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ id, children }: { id: string, children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`rounded-lg ${isOver ? 'bg-blue/20' : ''}`}>
      {children}
    </div>
  );
}
