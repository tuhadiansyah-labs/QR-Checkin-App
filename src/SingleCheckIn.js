import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';

export default function SingleCheckIn() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef();
  const html5QrCodeRef = useRef();

  useEffect(() => {
    if (!scannerRef.current) return;
    html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);
    html5QrCodeRef.current.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        setScanResult(decodedText);
        html5QrCodeRef.current.stop();
        // TODO: Call Google Apps Script endpoint to validate ticket
      },
      (err) => setError(err)
    );
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Single Check-In</h2>
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {!scanResult && (
          <div id="qr-scanner" ref={scannerRef} className="w-64 h-64 bg-black rounded-lg"></div>
        )}
        {scanResult && (
          <div className="bg-white rounded-lg shadow p-4 w-full text-center">
            <div className="text-green-600 font-bold">QR Code Scanned!</div>
            <div className="break-all text-gray-700 mt-2">{scanResult}</div>
            <div className="mt-4 text-sm text-gray-500">(Ticket validation with Google Sheets will appear here)</div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setScanResult(null)}>Scan Another</button>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Link to="/" className="mt-8 text-blue-600 underline">Back to Home</Link>
      </div>
    </div>
  );
}