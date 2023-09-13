import info from '@/package.json';

function DownloadLink({ ending, children }) {
  const { version } = info;
  const url = `https://github.com/spang-lab/dabih/releases/download/dabih-v${version}/dabih_${version}_${ending}`;
  return (
    <a
      className="text-white whitespace-nowrap bg-blue text-lg font-bold px-2 py-1 rounded-md shadow-lg"
      href={url}
    >
      {children}
    </a>
  );
}

export function MacDmgDownload() {
  return (
    <DownloadLink ending="x64.dmg">
      Download for macOS (dmg)
    </DownloadLink>
  );
}
export function MacAppDownload() {
  return (
    <DownloadLink ending="x64.app.tar.gz">
      Download for macOS (app)
    </DownloadLink>
  );
}
export function WindowsDownload() {
  return (
    <DownloadLink ending="x64_en-US.msi">
      Download for Windows (msi)
    </DownloadLink>
  );
}

export function LinuxDebDownload() {
  return (
    <DownloadLink ending="amd64.deb">
      Download for Linux (deb)
    </DownloadLink>
  );
}
export function LinuxAppDownload() {
  return (
    <DownloadLink ending="amd64.AppImage">
      Download for Linux (AppImage)
    </DownloadLink>
  );
}
