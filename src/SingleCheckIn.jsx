import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import QrReader from './components/QrReader';
import ConfirmationPage from './components/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CHECKIN_API_URL = 'https://checkinticket-4faso3ggca-uc.a.run.app';

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
  const [confirmation, setConfirmation] = useState(null); // {status, message, error}

  const handleScan = (qrText) => {
    const ticketId = extractTicketId(qrText);
    if (!ticketId) {
      setConfirmation({ status: 'error', message: 'Ticket ID not found in QR code!' });
      return;
    }
    setLoading(true);
    fetch(CHECKIN_API_URL, {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'success') {
          setConfirmation({ status: 'success', message: 'Check-in successful!' });
        } else if (data.status === 'already_checked_in') {
          setConfirmation({ status: 'error', message: 'Ticket already checked in!' });
        } else {
          setConfirmation({ status: 'error', message: 'Check-in failed.', error: JSON.stringify(data) });
        }
      })
      .catch((err) => {
        setLoading(false);
        setConfirmation({ status: 'error', message: 'Network error.', error: err?.message });
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
        {!loading && !confirmation && <QrReader onScan={handleScan} />}
        {confirmation && (
          <ConfirmationPage
            status={confirmation.status}
            message={confirmation.message}
            error={confirmation.error}
            onBack={() => setConfirmation(null)}
          />
        )}
      </Box>
    </Container>
  );
}

export default SingleCheckIn;