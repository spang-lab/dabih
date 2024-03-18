/* eslint-disable react/no-array-index-key, @typescript-eslint/no-loop-func */

'use client';

import React, { Fragment, useEffect, useState } from 'react';
import crypto from '@/lib/crypto';
import Image from 'next/image';
import QRCode from 'qrcode';

function Key({ privateKey }, ref: any) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      if (!privateKey) {
        return;
      }
      const json = await crypto.privateKey.toJSON(privateKey);
      const url = await QRCode.toDataURL(json, {
        errorCorrectionLevel: 'M',
        width: 600,
      });
      setDataUrl(url);
      const hex = await crypto.privateKey.toHex(privateKey);
      setHexData(hex);
    })();
  }, [privateKey]);
  if (!hexData || !dataUrl) {
    return null;
  }
  const longRow = 48;
  const shortRow = 22;
  const longRows = 10;
  const shortRows = 40;
  const shortStart = longRows * longRow;
  const shortEnd = shortStart + shortRows * shortRow;
  const qrIndex = shortStart + shortRow / 2;

  const rows: any[] = [];
  let idx = 0;
  while (idx < hexData.length) {
    let rdata: any[];
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

  const getColor = (v: string) => {
    const num = parseInt(v, 16);
    if (num < 75) {
      return 'text-gray-500';
    }
    if (num < 150) {
      return 'text-gray-800';
    }
    if (num < 225) {
      return 'text-blue';
    }
    return 'text-orange';
  };

  return (
    <div
      ref={ref}
      className="p-4 mx-0 my-3 text-center border-2 rounded border-blue"
    >
      <table className="mx-auto font-semibold leading-none table-fixed text-xs">
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
                          width={600}
                          height={600}
                          alt="Private Key QR Code"
                        />
                        <br />
                        <span className="font-semibold text-blue text-lg">
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
