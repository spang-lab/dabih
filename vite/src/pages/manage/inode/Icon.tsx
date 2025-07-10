
import {
  AlignJustify, Code, File, FileText, Film, Image as ImageIcon,
  Layout, Link, Speaker, Table, Triangle, Folder, Trash2,
  User,
} from "react-feather";
import { InodeMembers, InodeType } from "@/lib/api/types";
import { Spinner } from "@/util";



type FileType = "image" |
  "video" | "audio" | "text" | "document" | "pdf"
  | "spreadsheet" | "presentation"
  | "code" | "archive" | "other";



const getFileType = (ext?: string): FileType => {
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "image";
    case "mp4":
    case "webm":
    case "avi":
    case "mkv":
      return "video";
    case "mp3":
    case "wav":
    case "ogg":
      return "audio";
    case "txt":
    case "md":
    case "log":
    case "pem":
      return "text";
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
    case "odt":
      return "document";
    case "xls":
    case "xlsx":
    case "ods":
      return "spreadsheet";
    case "ppt":
    case "pptx":
    case "odp":
      return "presentation";
    case "js":
    case "ts":
    case "json":
    case "go":
    case "py":
    case "rb":
    case "java":
    case "c":
    case "cpp":
      return "code";
    case "zip":
    case "tar":
    case "gz":
    case "bz2":
    case "dmg":
      return "archive";
    default:
      return "other";
  }
}




export default function Icon({ inode }: { inode: InodeMembers }) {
  const { name, type } = inode;
  if (type === InodeType.DIRECTORY) {
    return (
      <Folder size={85} strokeWidth={0.5} className="fill-blue/60 text-blue " />
    );
  }
  if (type === InodeType.TRASH) {
    return (
      <div className="relative">
        <Folder size={80} strokeWidth={0.5} className="text-blue fill-blue/40" />
        <Trash2 size={40} strokeWidth={1} className="absolute bottom-4 left-5 text-gray-700 fill-gray-400/50" />
      </div>
    );
  }
  if (type === InodeType.HOME) {
    return (
      <div className="relative">
        <Folder size={80} strokeWidth={0.5} className="text-blue fill-blue/40" />
        <User size={40} strokeWidth={1} className="absolute bottom-4 left-5 text-blue fill-blue/50" />
      </div>
    );
  }
  if (type === InodeType.UPLOAD) {
    return (
      <div className="relative">
        <File size={80} strokeWidth={1} />
        <div className="absolute bottom-2 left-5 text-[10px] font-bold" >
          <Spinner small />
          Upload
        </div>
      </div>
    );
  }


  const ext = name.split(".").pop();
  const fileType = getFileType(ext);
  switch (fileType) {
    case "image":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <ImageIcon size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "video":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Film size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "audio":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Speaker size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "text":
      return (
        <div className="relative">
          <FileText size={80} strokeWidth={1} className="text-blue" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "document":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <AlignJustify size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-3xl font-extrabold bottom-5 text-center font-mono text-blue">
            W
          </div>
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "pdf":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <AlignJustify size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-3xl font-extrabold bottom-5 text-center font-mono text-red">
            A
          </div>
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "spreadsheet":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Table size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-3xl font-extrabold bottom-5 text-center font-mono text-green">
            E
          </div>
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "presentation":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Layout size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-3xl font-extrabold bottom-5 text-center font-mono text-orange">
            P
          </div>
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "code":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Code size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "archive":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
          <Link size={24} className=" rotate-[-45deg] absolute top-2 left-4" />
          <Link size={24} className=" rotate-[-45deg] absolute top-7 left-4" />

        </div>
      );
    default:
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} className="text-blue" />
          <Triangle size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
  }
}
