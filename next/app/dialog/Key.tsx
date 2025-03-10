/* eslint-disable react/no-array-index-key, @typescript-eslint/no-loop-func */

'use client';

import React, { ForwardedRef, Fragment } from 'react';
import Image from 'next/image';

interface HexValue {
  v: string,
  color: string,
  colIdx: number,
}

interface HexRow {
  data: HexValue[],
  rowIdx: number,
}


const toHexValue = (v: string, colIdx: number): HexValue => {
  const num = parseInt(v, 16);
  const color = num < 75 ? 'text-gray-500' : num < 150 ? 'text-gray-800' : num < 225 ? 'text-blue' : 'text-orange';
  return { v, color, colIdx };
}

function HexKey({ qrCode, hexData }: { qrCode: string, hexData: string[] }, ref: ForwardedRef<HTMLDivElement>) {
  const longRow = 48;
  const shortRow = 22;
  const longRows = 10;
  const shortRows = 40;
  const shortStart = longRows * longRow;
  const shortEnd = shortStart + shortRows * shortRow;
  const qrIndex = shortStart + shortRow / 2;

  const rows: HexRow[] = [];
  let idx = 0;
  while (idx < hexData.length) {
    let data: HexValue[];
    if (idx < shortStart || idx >= shortEnd) {
      data = hexData
        .slice(idx, idx + longRow)
        .map((v, i) => toHexValue(v, i + idx));
      idx += longRow;
    } else {
      data = hexData
        .slice(idx, idx + shortRow)
        .map((v, i) => toHexValue(v, i + idx));
      idx += shortRow;
    }
    rows.push({ data: data, rowIdx: idx });
  }

  return (
    <div
      ref={ref}
      className="p-4 mx-0 my-3 text-center border-2 rounded-sm border-blue"
    >
      <table className="mx-auto font-semibold leading-none table-fixed text-xs">
        <tbody>
          {rows.map((row) => (
            <tr key={row.rowIdx}>
              {row.data.map(({ v, colIdx, color }) => {
                if (colIdx === qrIndex) {
                  return (
                    <Fragment key={colIdx}>
                      <td rowSpan={shortRows} colSpan={longRow - shortRow}>
                        <Image
                          className="mx-auto"
                          src={qrCode}
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
                      <td className={color}>{v}</td>
                    </Fragment>
                  );
                }
                return (
                  <td key={colIdx} className={color}>
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
export default React.forwardRef(HexKey);
