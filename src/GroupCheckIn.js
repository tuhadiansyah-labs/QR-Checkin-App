import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Card, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const mockGroupData = [
  { id: 1, name: 'Alice Smith', checkedIn: false },
  { id: 2, name: 'Bob Johnson', checkedIn: false },
  { id: 3, name: 'Charlie Lee', checkedIn: false },
];

export default function GroupCheckIn() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState([]);

  const checkInMember = (id) => {
    setGroup((prev) => prev.map((m) => m.id === id ? { ...m, checkedIn: true } : m));
  };

  const checkInAll = () => {
    setGroup((prev) => prev.map((m) => ({ ...m, checkedIn: true })));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Group Check-In</h2>
        {!scanResult && (
          <div className="flex flex-col items-center">
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={(err, result) => {
                if (result) {
                  setScanResult(result.text);
                  setError(null);
                  setGroup(mockGroupData);
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
            <div className="text-green-600 font-bold mb-2">Group QR Scanned!</div>
            <div className="break-all text-gray-700 mb-2">{scanResult}</div>
            <div className="mb-4 w-full">
              <div className="font-semibold mb-2 text-center">Guests:</div>
              <ul className="space-y-2">
                {group.map((member) => (
                  <li key={member.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                    <span className={member.checkedIn ? 'line-through text-gray-400' : ''}>{member.name}</span>
                    <Button
                      color={member.checkedIn ? 'success' : 'blue'}
                      size="xs"
                      disabled={member.checkedIn}
                      onClick={() => checkInMember(member.id)}
                    >
                      {member.checkedIn ? 'Checked In' : 'Check In'}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              color="indigo"
              className="w-full mb-2"
              onClick={checkInAll}
              disabled={group.every((m) => m.checkedIn)}
            >
              Check In All
            </Button>
            <Button color="blue" onClick={() => { setScanResult(null); setGroup([]); }} className="mb-2">Scan Another</Button>
          </div>
        )}
        <Link to="/" className="mt-4 text-indigo-600 underline text-center">Back to Home</Link>
      </Card>
    </div>
  );
}