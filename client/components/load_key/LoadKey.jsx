import React from 'react';

import { Title2 } from '../util';
import WebcamScan from './WebcamScan';
import LoadPrivateKey from './LoadPrivateKey';

function Card({ children }) {
  return (
    <div className="flex items-center justify-center w-full border-2 rounded-xl h-80 bg-sky-50 border-sky-800 sm:h-64">
      {children}
    </div>
  );
}

export default function LoadKey({ isVisible }) {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="py-12">
      <Title2>
        Load your existing key
      </Title2>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-6">
            <Card>
              <WebcamScan />
            </Card>
            <Card>
              <LoadPrivateKey />
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
