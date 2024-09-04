
export default function FileName(
  { hidden, fileName }:
    {
      hidden?: boolean,
      fileName: string
    }) {
  if (hidden) {
    return null;
  }
  const n = fileName.length;
  let textSize = "text-md";
  if (n > 15) {
    textSize = "text-sm";
  }
  if (n > 25) {
    textSize = "text-xs";
  }
  if (n > 45) {
    textSize = "text-[10px]";
  }
  return (
    <span className={"text-wrap text-center break-words " + textSize}>{fileName}</span>
  );
}
