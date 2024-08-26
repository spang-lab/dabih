
import { AlignJustify, Box, Code, CreditCard, File, FileText, Film, Grid, Image as ImageIcon, Layout, Link, Map, Speaker, Triangle } from "react-feather";



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




export default function Icon({ fileName }: { fileName: string }) {
  const ext = fileName.split(".").pop();

  const type = getFileType(ext);

  switch (type) {
    case "image":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} />
          <ImageIcon size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "video":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} />
          <Film size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "audio":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} />
          <Speaker size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "text":
      return (
        <div className="relative">
          <FileText size={80} strokeWidth={1} />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "document":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} />
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
          <File size={80} strokeWidth={1} />
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
          <File size={80} strokeWidth={1} />
          <Grid size={24} className="text-gray-400 absolute bottom-6 left-7" />
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
          <File size={80} strokeWidth={1} />
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
          <File size={80} strokeWidth={1} />
          <Code size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
    case "archive":
      return (
        <div className="relative">
          <File size={80} strokeWidth={1} />
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
          <File size={80} strokeWidth={1} />
          <Triangle size={24} className="text-gray-400 absolute bottom-6 left-7" />
          <div className="absolute w-[80px] text-xs bottom-2 text-center font-mono text-orange">
            {ext}
          </div>
        </div>
      );
  }
}
