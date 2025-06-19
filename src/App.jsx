import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import SingleCheckIn from './SingleCheckIn';
import GroupCheckIn from './GroupCheckIn';

function Landing() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          QR Event Check-In
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome! Please select a check-in mode:
        </Typography>
        <Box mt={4} display="flex" flexDirection="column" gap={2}>
          <Button variant="contained" size="large" fullWidth onClick={() => navigate('/single')}>Single Check-In</Button>
          <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/group')}>Group Check-In</Button>
        </Box>
      </Paper>
    </Container>
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
