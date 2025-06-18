import React, { useState } from "react";
import Scanner from "./Scanner";

export default function App() {
  const [result, setResult] = useState("Waiting for scan...");

  function handleScan(data) {
    // Simulate validation logic
    setResult(`✅ Scanned: ${data}`);
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: 20,
        color: "#fff",
        backgroundColor: "#000",
        minHeight: "100vh",
      }}
    >
      <h2>QR Code Check-in Scanner</h2>
      <Scanner onScan={handleScan} />
      <div
        id="result"
        style={{
          marginTop: 20,
          fontSize: 22,
          minHeight: 30,
        }}
      >
        {result}
      </div>
    </div>
  );
}
