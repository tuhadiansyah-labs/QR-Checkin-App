import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScan }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(scannerRef.current.id);

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.pause();
          setTimeout(() => html5QrCode.resume(), 2000);
        }
      )
      .then(() => setScanning(true))
      .catch((err) => {
        console.error("Unable to start scanning:", err);
      });

    return () => {
      if (scanning) {
        html5QrCode.stop().catch((err) => console.error("Failed to stop scanner", err));
      }
    };
  }, [onScan, scanning]);

  return (
    <div
      id="reader"
      ref={scannerRef}
      style={{ width: '500px', height: '500px', margin: 'auto' }}
    ></div>
  );
}
