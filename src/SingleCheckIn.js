import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Card, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function SingleCheckIn() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Single Check-In</h2>
        {!scanResult && (
          <div className="flex flex-col items-center">
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={(err, result) => {
                if (result) {
                  setScanResult(result.text);
                  setError(null);
                } else if (err) {
                  setError('No QR code detected');
                }
              }}
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        )}
        {scanResult && (
          <div className="flex flex-col items-center">
            <div className="text-green-600 font-bold mb-2">QR Code Scanned!</div>
            <div className="break-all text-gray-700 mb-2">{scanResult}</div>
            <div className="mb-4 text-sm text-gray-500">(Ticket validation with Google Sheets will appear here)</div>
            <Button color="blue" onClick={() => setScanResult(null)} className="mb-2">Scan Another</Button>
          </div>
        )}
        <Link to="/" className="mt-4 text-blue-600 underline text-center">Back to Home</Link>
      </Card>
    </div>
  );
}