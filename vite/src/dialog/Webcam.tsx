/* eslint-disable react-hooks/exhaustive-deps */
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Spinner } from '@/util';
import { DialogTransition } from './Transition';

const calculateScanRegion = (video: HTMLVideoElement) => {
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

export default function WebcamDialog({
  show,
  onSubmit,
  onError,
  onClose,
}:
  {
    show: boolean,
    onSubmit: (data: string) => void,
    onError: (error: string) => void,
    onClose: () => void
  }) {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scanner: QrScanner | null = null;
    if (!videoRef.current || !overlayRef.current || !show) {
      return;
    }

    scanner = new QrScanner(videoRef.current,
      (result: QrScanner.ScanResult) => {
        onSubmit(result.data);
        onClose();
      },
      {
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
        if (e instanceof Error) {
          onError(e.message);
          return;
        }
        onError('Failed to start QR Code scanner');
      }
    };
    void startScanner();

    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  }, [show, videoRef]);

  return (
    <DialogTransition show={show} onClose={onClose}>
      <DialogPanel className="w-full max-w-4xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all">
        <DialogTitle
          as="h2"
          className="text-2xl font-extrabold text-gray-800 leading-6"
        >
          Scan your code
        </DialogTitle>
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
          <Spinner loading={loading} />
        </div>
        <div className="text-right mt-3">
          <button
            type="button"
            className="mx-3 px-2 py-1 text-white bg-gray-400 hover:text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </DialogTransition>
  );
}
