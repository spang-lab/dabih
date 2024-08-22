
import Upload from "./Upload";

export default function UploadPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Upload
        {' '}
        <span className="text-blue">your data</span>
      </h1>
      <Upload />
    </div>
  );
}
