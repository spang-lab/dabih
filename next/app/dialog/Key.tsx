
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

const toRgb = (v: string): { r: number, g: number, b: number } => {
  const num = parseInt(v.slice(1), 16);
  return { r: num >> 16, g: (num >> 8) & 0xff, b: num & 0xff };
}

const toHexValue = (v: string, colIdx: number): HexValue => {
  const blue = "#145876";
  const orange = "#ea580c";
  const alpha = parseInt(v, 16) / 255;

  const blueRgb = toRgb(blue);
  const orangeRgb = toRgb(orange);
  const r = Math.round(blueRgb.r * alpha + orangeRgb.r * (1 - alpha));
  const g = Math.round(blueRgb.g * alpha + orangeRgb.g * (1 - alpha));
  const b = Math.round(blueRgb.b * alpha + orangeRgb.b * (1 - alpha));
  const color = `rgb(${r},${g},${b})`;
  console.log(color);


  return { v, color, colIdx };
}

function HexKey({ qrCode, hexData }: { qrCode: string, hexData: string[] }, ref: ForwardedRef<HTMLDivElement>) {
  const longRow = 50;
  const shortRow = 22;
  const longRows = 10;
  const shortRows = 48;
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
                      <td style={{ color }}>{v}</td>
                    </Fragment>
                  );
                }
                return (
                  <td key={colIdx} style={{ color }}>
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
