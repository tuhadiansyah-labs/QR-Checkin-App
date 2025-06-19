import { Container, Typography, Box } from '@mui/material';
import QrReader from './components/QrReader';

function GroupCheckIn() {
  const handleScan = (data) => {
    if (data) {
      alert(`Scanned: ${data}`);
      // TODO: Add group check-in logic here
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Group Check-In
        </Typography>
        <Typography variant="body1" gutterBottom>
          Scan a group QR code to retrieve all tickets for the group and check in guests individually or all at once.
        </Typography>
        <QrReader onScan={handleScan} />
      </Box>
    </Container>
  );
}

export default GroupCheckIn;