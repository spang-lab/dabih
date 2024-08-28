
export default function FileName({ fileName }: { fileName: string }) {
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
