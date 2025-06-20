import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import SingleCheckIn from './SingleCheckIn';
import GroupCheckIn from './GroupCheckIn';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

function Landing() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: { xs: 6, sm: 10 } }}>
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
          QR Code Check-In
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 4 }}>
          Please select a check-in mode:
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" width="100%" maxWidth={400}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              width: 148,
              height: 148,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: '1.1rem',
              p: 0
            }}
            onClick={() => navigate('/single')}
          >
            <PersonIcon sx={{ fontSize: 48, mb: 1 }} />
            Single
            <br />Check-In
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 3,
              width: 148,
              height: 148,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: '1.1rem',
              p: 0
            }}
            onClick={() => navigate('/group')}
          >
            <GroupIcon sx={{ fontSize: 48, mb: 1 }} />
            Group
            <br />Check-In
          </Button>
        </Stack>
      </Box>
    </Box>
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
