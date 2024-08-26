
import { InodeMembers, InodeType } from "@/lib/api/types";
import Icon from "./Icon";


function FileName({ fileName }: { fileName: string }) {
  if (fileName.length <= 15) {
    return (
      <span className="text-wrap text-center break-words">{fileName}</span>
    );
  }
  if (fileName.length <= 25) {
    return (
      <span className="text-wrap text-center text-sm break-words">{fileName}</span>
    );
  }
  if (fileName.length <= 45) {
    return (
      <span className="text-wrap  text-center text-xs break-words">{fileName}</span>
    );
  }
  return (
    <span className="text-wrap text-center text-[10px] break-words">{fileName}</span>
  );
}



export default function Inode({
  data: node,
  selected,
  onClick
}: {
  data: InodeMembers,
  selected: boolean
}) {


  const { type } = node;
  if (type === InodeType.FILE) {
    const { fileName } = node.data!;
    return (
      <div
        className="w-32 flex h-fit flex-col rounded-xl text-blue items-center m-2">
        <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
          <Icon fileName={fileName} />
        </div>
        <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
          <FileName fileName={fileName} />
        </div>
      </div>
    );
  }

  return (
    <div className="border text-xs">
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
