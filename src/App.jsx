import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, Paper, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import SingleCheckIn from './SingleCheckIn';
import GroupCheckIn from './GroupCheckIn';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Replace with your actual Firebase Functions URL
        const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/getCheckInStats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: { xs: 6, sm: 10 } }}>
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
          QR Code Check-In
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 4 }}>
          Please select a check-in mode:
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" width="100%" maxWidth={400} mb={4}>
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

        {/* Statistics Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            Check-In Statistics
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Typography variant="body2" color="error" sx={{ py: 2 }}>
              Error loading statistics: {error}
            </Typography>
          )}

          {stats && !loading && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body1">Checked In:</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {stats.checkedInTickets} / {stats.totalTickets}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PendingIcon color="warning" />
                  <Typography variant="body1">Pending:</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="warning.main">
                  {stats.notCheckedInTickets}
                </Typography>
              </Box>

              <Box sx={{
                width: '100%',
                bgcolor: 'grey.200',
                borderRadius: 1,
                overflow: 'hidden',
                height: 8
              }}>
                <Box
                  sx={{
                    height: '100%',
                    bgcolor: 'success.main',
                    width: `${stats.checkInPercentage}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {stats.checkInPercentage}% Complete
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                Last updated: {stats.timestamp}
              </Typography>
            </Stack>
          )}
        </Paper>
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
