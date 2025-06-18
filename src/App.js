import React, { useState } from 'react';
import Scanner from './Scanner';

function App() {
  const [result, setResult] = useState('');

  function handleScan(data) {
    setResult(data);
    // You can call your backend API or Google Apps Script here to validate ticket
    console.log('Scanned:', data);
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>QR Code Check-in Scanner</h2>
      <Scanner onScan={handleScan} />
      <div style={{ marginTop: 20, fontSize: 18 }}>
        {result ? `Scan result: ${result}` : 'Scan a QR code'}
      </div>
    </div>
  );
}

export default App;
