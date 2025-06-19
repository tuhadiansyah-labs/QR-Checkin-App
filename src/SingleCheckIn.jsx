import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import QrReader from './components/QrReader';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyA6EkqwKWxngNpO4U8WAXrHxU7rPyX0BaQIB9cVTvwMB3s2_xycMC-jB-Xecox9F0E/exec';

function extractTicketId(qrText) {
  const match = qrText.match(/Ticket ID:\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

function SingleCheckIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleScan = (qrText) => {
    const ticketId = extractTicketId(qrText);
    if (!ticketId) {
      alert('Ticket ID not found in QR code!');
      return;
    }
    setLoading(true);
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        // TODO: Show confirmation page here
        alert(JSON.stringify(data));
      })
      .catch(() => {
        setLoading(false);
        alert('Network error.');
      });
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Single Check-In
        </Typography>
        <Typography variant="body1" gutterBottom>
          Scan a ticket QR code to verify and check in a single guest.
        </Typography>
        {loading && <CircularProgress sx={{ mt: 4 }} />}
        {!loading && <QrReader onScan={handleScan} />}
      </Box>
    </Container>
  );
}

export default SingleCheckIn;