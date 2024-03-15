'use client';

import { Dialog } from '@headlessui/react';

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Spinner } from '@/components/util';

const calculateScanRegion = (video) => {
  const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
  const scanRegionSize = Math.round((4 / 5) * smallestDimension);
  return {
    x: Math.round((video.videoWidth - scanRegionSize) / 2),
    y: Math.round((video.videoHeight - scanRegionSize) / 2),
    width: scanRegionSize,
    height: scanRegionSize,
    downScaledWidth: scanRegionSize,
    downScaledHeight: scanRegionSize,
  };
};

export default function Webcam({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const [loading, setLoading] = useState(true);
  const videoRef = useRef();
  const overlayRef = useRef();

  const onCode = (code) => {
    const { data } = code;
    onSubmit(data);
    closeDialog();
  };

  useEffect(() => {
    let scanner = null;
    if (!videoRef.current || !onCode) {
      return undefined;
    }

    scanner = new QrScanner(videoRef.current, onCode, {
      returnDetailedScanResult: true,
      preferredCamera: 'environment',
      calculateScanRegion,
      maxScansPerSecond: 2,
      overlay: overlayRef.current,
      highlightScanRegion: true,
    });

    const startScanner = async () => {
      try {
        await scanner.start();
        setLoading(false);
      } catch (e) {
        onSubmit({ error: e });
        closeDialog();
      }
    };
    startScanner();

    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  }, []);

  const getSpinner = () => {
    if (!loading) {
      return null;
    }
    return (
      <div className="flex items-center justify-center h-72">
        <Spinner />
      </div>
    );
  };

  return (
    <Dialog.Panel className="w-full max-w-4xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-gray-800 leading-6"
      >
        Scan your code
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-400">
          Make sure to position your QR code in the marked region.
        </p>
      </div>
      <div className="stroke-blue">
        <video ref={videoRef} playsInline muted />
        <div
          className="border bg-gray-100 bg-opacity-10 border-blue"
          ref={overlayRef}
        />
        {getSpinner()}
      </div>
      <div className="text-right mt-3">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
