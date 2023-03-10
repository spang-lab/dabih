/* eslint-disable jsx-a11y/media-has-caption, react-hooks/exhaustive-deps */
import React, {
  useEffect, useRef, useState,
} from 'react';
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

    scanner.start().then(() => setLoading(false)).catch(onError);

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
    <div className="stroke-sky-700">
      <video ref={videoRef} playsInline muted />
      <div className="border bg-sky-100 bg-opacity-10 border-sky-800" ref={overlayRef} />
      {getSpinner()}
    </div>
  );
}
