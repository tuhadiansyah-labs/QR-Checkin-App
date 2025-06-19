import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SingleCheckIn from './SingleCheckIn';
import GroupCheckIn from './GroupCheckIn';

function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">QR Event Check-In</h1>
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link to="/single" className="bg-white text-blue-600 font-semibold py-4 rounded-lg shadow hover:bg-blue-50 transition">Single Check-In</Link>
        <Link to="/group" className="bg-white text-indigo-600 font-semibold py-4 rounded-lg shadow hover:bg-indigo-50 transition">Group Check-In</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/single" element={<SingleCheckIn />} />
        <Route path="/group" element={<GroupCheckIn />} />
      </Routes>
    </Router>
  );
}

export default App;
