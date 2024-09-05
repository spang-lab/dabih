interface BytesProps {
  value: number,
  decimals?: number,
  binary?: boolean,
}

export default function Bytes({ value, decimals = 2, binary = false }: BytesProps) {


  if (!value || value === 0) return '0 B';
  const dm = decimals < 0 ? 0 : decimals;
  const sizesBinary = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const sizesBase10 = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const k = (binary) ? 1024 : 1000;
  const sizes = (binary) ? sizesBinary : sizesBase10;


  const i = Math.floor(Math.log(value) / Math.log(k));
  return `${parseFloat((value / k ** i).toFixed(dm))} ${sizes[i]}`;
}
