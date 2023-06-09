/* eslint-disable react/no-array-index-key, no-loop-func */
import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';

const createDataUrl = async (privateKey) => {
  const options = {
    errorCorrectionLevel: 'L',
  };
  return QRCode.toDataURL([{ data: privateKey, mode: 'byte' }], options);
};

function Key({ data }, ref) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    const setUrl = async () => {
      const url = await createDataUrl(data);
      setDataUrl(url);
    };
    setUrl();
  }, [data]);
  if (!data || !dataUrl) {
    return null;
  }
  const hexData = [...new Uint8Array(data)].map((v) => v.toString(16).toUpperCase().padStart(2, '0'));
  const longRow = 32;
  const shortRow = 14;
  const longRows = 13;
  const shortRows = 23;
  const shortStart = longRows * longRow;
  const shortEnd = shortStart + shortRows * shortRow;
  const qrIndex = shortStart + shortRow / 2;

  const rows = [];
  let idx = 0;
  while (idx < hexData.length) {
    let rdata;
    if (idx < shortStart || idx >= shortEnd) {
      rdata = hexData
        .slice(idx, idx + longRow)
        .map((v, i) => ({ v, j: i + idx }));
      idx += longRow;
    } else {
      rdata = hexData
        .slice(idx, idx + shortRow)
        .map((v, i) => ({ v, j: i + idx }));
      idx += shortRow;
    }
    rows.push({ data: rdata, key: `row-${idx}` });
  }

  const getColor = (v) => {
    const num = parseInt(v, 16);
    if (num < 50) {
      return 'text-main-mid';
    }
    if (num < 100) {
      return 'text-gray-light0';
    }
    if (num < 150) {
      return 'text-main-mid';
    }
    if (num < 200) {
      return 'text-main-mid';
    }
    return 'text-main-mid';
  };

  return (
    <div
      ref={ref}
      className="p-4 mx-0 my-3 text-center border-2 rounded border-main-mid"
    >
      <table className="mx-auto text-lg font-semibold leading-none table-fixed">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.data.map(({ v, j }) => {
                if (j === qrIndex) {
                  return (
                    <Fragment key={j}>
                      <td rowSpan={shortRows} colSpan={longRow - shortRow}>
                        <Image
                          className="mx-auto"
                          src={dataUrl}
                          width={400}
                          height={400}
                          alt="Private Key QR Code"
                        />
                        <br />
                        <span className="font-semibold text-main-mid">
                          {' '}
                          Dabih private key v1
                          {' '}
                        </span>
                      </td>
                      <td className={getColor(v)}>{v}</td>
                    </Fragment>
                  );
                }
                return (
                  <td key={j} className={getColor(v)}>
                    {v}
                  </td>
                );
              })}
              <td className="invisible">xxx</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default React.forwardRef(Key);
