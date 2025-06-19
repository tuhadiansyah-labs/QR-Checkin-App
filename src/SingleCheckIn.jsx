import { Container, Typography, Box } from '@mui/material';
import QrReader from './components/QrReader';

function SingleCheckIn() {
  const handleScan = (data) => {
    if (data) {
      alert(`Scanned: ${data}`);
      // TODO: Add check-in logic here
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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