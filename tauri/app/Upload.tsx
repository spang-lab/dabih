import { CheckCircle, Clock, UploadCloud } from 'react-feather';
import { formatBytes } from './Bytes';

export default function Upload({ data }: {data: any}) {
  const {
    mnemonic, total, current, path, state,
  } = data;
  const fileName = path.split('/').at(-1);

  if (state === 'waiting') {
    return (
      <div className="border border-gray-600 rounded-md p-2 m-2">
        <h3 className="text-lg font-extrabold">
          <Clock className="inline-flex mx-3" size={30} />
          Queued
          <span className="px-3">
            &quot;
            {fileName}
            &quot;
          </span>
        </h3>
        <p className="text-xs font-thin text-gray-400">
          Full path:
          {' '}
          {path}
        </p>
      </div>
    );
  }
  if (state === 'skipped') {
    return (
      <div className="border border-gray-600 rounded-md p-2 m-2">
        <h3 className="text-lg font-extrabold">
          <CheckCircle className="inline-flex mx-3 text-blue" size={30} />
          Skipped
          <span className="px-3">
            &quot;
            {fileName}
            &quot;
          </span>
          File exists already.
        </h3>
        <p className="text-xs font-thin text-gray-400">
          Full path:
          {' '}
          {path}
        </p>
      </div>
    );
  }

  if (state === 'complete') {
    return (
      <div className="border border-gray-600 rounded-md p-2 m-2">
        <h3 className="text-lg font-extrabold">
          <CheckCircle className="inline-flex mx-3 text-green" size={30} />
          Uploaded
          <span className="px-3">
            &quot;
            {fileName}
            &quot;
          </span>
          as
          <span className="text-blue px-3 font-mono font-bold">
            {mnemonic}
          </span>
        </h3>
        <p className="text-xs font-thin text-gray-400">
          Full path:
          {' '}
          {path}
        </p>
      </div>
    );
  }

  const percent = Math.round((1000 * current) / total) / 10;
  const progressStr = `${percent}%`;

  return (
    <div className="border border-gray-600 rounded-md p-2 m-2">
      <h3 className="text-lg font-extrabold">
        <UploadCloud className="inline-flex mx-3" size={30} />
        Uploading
        <span className="px-3">
          &quot;
          {fileName}
          &quot;
        </span>
      </h3>
      <p className="text-xs font-thin text-gray-400">
        Full path:
        {' '}
        {path}
      </p>
      <div className="flex flex-row items-center">
        <div className="font-mono text-blue font-bold border-r w-52">
          {mnemonic}
        </div>
        <div className="grow bg-gray-200 rounded-md mx-4 ">
          <div
            className="bg-blue p-0.5 text-center rounded-md text-xs font-medium leading-none text-white"
            style={{ width: progressStr }}
          >
            {progressStr}
          </div>
        </div>
        <div className=" w-36 text-center text-xs border-l">
          <p className="whitespace-nowrap">
            {formatBytes(current)}
            {' '}
            /
            {' '}
            {formatBytes(total)}
          </p>
          <p className="whitespace-nowrap">
            {formatBytes(current, 2, false)}
            {' '}
            /
            {' '}
            {formatBytes(total, 2, false)}

          </p>
        </div>

      </div>
    </div>
  );
}
