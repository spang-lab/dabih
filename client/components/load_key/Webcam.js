/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Spinner } from '../util';

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

export default function Webcam({ onCode, onError }) {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef();
  const overlayRef = useRef();

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
        onError(e);
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
    <div className="stroke-main-200">
      <video ref={videoRef} playsInline muted />
      <div
        className="border bg-gray-100 bg-opacity-10 border-main-200"
        ref={overlayRef}
      />
      {getSpinner()}
    </div>
  );
}
