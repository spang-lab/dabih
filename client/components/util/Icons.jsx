import React from 'react';
import {
  Unlock, FileText, Key, Lock,
} from 'react-feather';

export function AesKeyIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <Key className="absolute inline-block text-blue-500 top-2 left-2" size={20} />
        <Lock className="inline-block" size={40} />
        <span className="absolute text-sm font-extrabold bottom-1 right-2 ">AES</span>
      </div>
      <div className="text-xs font-bold text-sky-700">Key</div>
    </div>
  );
}

export function PrivateKeyIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <Key className="inline-block" size={32} />
        <span className="absolute bottom-0 text-sm font-extrabold right-1 ">RSA</span>
      </div>
      <div className="text-xs font-bold text-sky-700">Private Key</div>
    </div>
  );
}

export function PublicKeyIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <Lock className="inline-block" size={40} />
        <span className="absolute text-sm font-extrabold bottom-1 right-2 ">RSA</span>
      </div>
      <div className="text-xs font-bold text-sky-700">Public Key</div>
    </div>
  );
}

export function DatasetIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <FileText className="inline-block" size={40} />
      </div>
      <div className="text-xs font-bold text-sky-700">Dataset</div>
    </div>
  );
}
export function EncryptedDatasetIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <FileText className="inline-block" size={40} />
        <Lock className="absolute bottom-0 -right-[1px] inline-block text-rose-700" size={20} strokeWidth={3} />
      </div>
      <div className="text-xs font-bold text-sky-700">
        Encrypted
        <br />
        Dataset
      </div>
    </div>
  );
}
export function DecryptedDatasetIcon() {
  return (
    <div className="inline-block p-1 text-center">
      <div className="relative inline-block w-12 h-12 p-1 border rounded border-sky-700 text-sky-700">
        <FileText className="inline-block" size={40} />
        <Unlock className="absolute bottom-0 inline-block text-green-700 -right-[1px]" size={20} strokeWidth={3} />
      </div>
      <div className="text-xs font-bold text-sky-700">
        Decrypted
        <br />
        Dataset
      </div>
    </div>
  );
}

export function Arrow({ length, label }) {
  const d = `M10, 10, ${length} 10`;
  const x = `${Math.round(length / 2)}`;
  const style = {
    width: `${length + 20}px`,
  };
  const className = 'inline-block h-8 text-sm font-extrabold text-sky-700';

  return (
    <svg className={className} style={style}>
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="3"
          markerHeight="4"
          refX="0.1"
          refY="2"
        >
          <path d="M0,0 V4 L2,2 Z" fill="currentColor" />
        </marker>
      </defs>

      <path
        id="arrow-line"
        markerEnd="url(#head)"
        strokeWidth="4"
        fill="none"
        stroke="currentColor"
        d={d}
      />
      <text
        x={x}
        y="25"
        fill="currentColor"
      >
        {label}

      </text>

    </svg>
  );
}
