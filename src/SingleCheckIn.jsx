import { Container, Typography, Box, Button, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import QrReader from './components/QrReader';
import ConfirmationPage from './components/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        if (data.status === 'SUCCESS') {
          setConfirmation({ status: 'success', message: data.message });
        } else if (data.status === 'ALREADY_CHECKEDIN') {
          setConfirmation({ status: 'error', message: data.message });
        } else if (data.status === 'NOT_FOUND') {
          setConfirmation({ status: 'error', message: data.message });
        } else if (data.status === 'ERROR') {
          setConfirmation({ status: 'error', message: data.message, error: JSON.stringify(data) });
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
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', px: 0 }}>
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            Single Check-In
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
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