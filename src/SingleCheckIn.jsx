import { Container, Typography, Box, Button } from '@mui/material';
import QrReader from './components/QrReader';
import { useNavigate } from 'react-router-dom';

function SingleCheckIn() {
  const navigate = useNavigate();
  const handleScan = (data) => {
    if (data) {
      alert(`Scanned: ${data}`);
      // TODO: Add check-in logic here
    }
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
        <QrReader onScan={handleScan} />
      </Box>
    </Container>
  );
}

export default SingleCheckIn;