import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
        // TODO: Fetch group data from Google Sheets using decodedText
        setGroup(mockGroupData);
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

  const checkInMember = (id) => {
    setGroup((prev) => prev.map((m) => m.id === id ? { ...m, checkedIn: true } : m));
  };

  const checkInAll = () => {
    setGroup((prev) => prev.map((m) => ({ ...m, checkedIn: true })));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4">Group Check-In</h2>
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {!scanResult && (
          <div id="qr-group-scanner" ref={scannerRef} className="w-64 h-64 bg-black rounded-lg"></div>
        )}
        {scanResult && (
          <div className="bg-white rounded-lg shadow p-4 w-full text-center">
            <div className="text-green-600 font-bold mb-2">Group QR Scanned!</div>
            <div className="break-all text-gray-700 mb-4">{scanResult}</div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Guests:</div>
              <ul className="space-y-2">
                {group.map((member) => (
                  <li key={member.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                    <span className={member.checkedIn ? 'line-through text-gray-400' : ''}>{member.name}</span>
                    <button
                      className={`ml-4 px-2 py-1 rounded text-xs font-semibold ${member.checkedIn ? 'bg-green-300 text-green-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      disabled={member.checkedIn}
                      onClick={() => checkInMember(member.id)}
                    >
                      {member.checkedIn ? 'Checked In' : 'Check In'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="w-full py-2 bg-indigo-600 text-white rounded font-bold disabled:bg-indigo-300"
              onClick={checkInAll}
              disabled={group.every((m) => m.checkedIn)}
            >
              Check In All
            </button>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setScanResult(null); setGroup([]); }}>Scan Another</button>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Link to="/" className="mt-8 text-indigo-600 underline">Back to Home</Link>
      </div>
    </div>
  );
}