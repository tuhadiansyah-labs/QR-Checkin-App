import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, Stack, CircularProgress } from '@mui/material';
import QrReader from './components/QrReader';
import ConfirmationPage from './components/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxLDOFzm6j2wtESUH8rj0AyHY9hA8TsEMPWax54Mjk0wBke48DrUh1X9ncSftwNGgpt/exec';

function extractGroupId(qrText) {
  const match = qrText.match(/Group:\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

function extractTicketId(qrText) {
  const match = qrText.match(/Ticket ID:\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

function GroupCheckIn() {
  const navigate = useNavigate();
  const [groupGuests, setGroupGuests] = useState(null);
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null); // {status, message, error}

  const handleScan = (qrText) => {
    const groupId = extractGroupId(qrText);
    if (!groupId) {
      alert('Group ID not found in QR code!');
      return;
    }
    setLoading(true);
    fetch(`${WEB_APP_URL}?groupId=${encodeURIComponent(groupId)}`)
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (result.status === 'success') {
          setGroupGuests(result.rows);
          setGroupId(groupId);
        } else {
          setGroupGuests([]);
          setGroupId(groupId);
          alert('Group not found!');
        }
      })
      .catch(() => {
        setLoading(false);
        alert('Network error.');
      });
  };

  const handleCheckIn = (qrTextOrTicketId) => {
    let ticketId = qrTextOrTicketId;
    if (typeof qrTextOrTicketId === 'string' && qrTextOrTicketId.includes('Ticket ID:')) {
      ticketId = extractTicketId(qrTextOrTicketId);
    }
    if (!ticketId) {
      setConfirmation({ status: 'error', message: 'Ticket ID not found in QR code!' });
      return;
    }
    setLoading(true);
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (result.status === 'success') {
          setConfirmation({ status: 'success', message: 'Check-in successful!' });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
        } else if (result.status === 'already_checked_in') {
          setConfirmation({ status: 'error', message: 'Ticket already checked in!' });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
        } else {
          setConfirmation({ status: 'error', message: 'Check-in failed.', error: JSON.stringify(result) });
        }
      })
      .catch((err) => {
        setLoading(false);
        setConfirmation({ status: 'error', message: 'Network error.', error: err?.message });
      });
  };

  const handleCheckInAll = () => {
    if (!groupGuests) return;
    const notCheckedIn = groupGuests.filter(g => g[5] !== 'Yes');
    if (notCheckedIn.length === 0) return;
    notCheckedIn.forEach((guest, idx) => {
      setTimeout(() => handleCheckIn(guest[1]), idx * 200); // Stagger requests
    });
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Group Check-In
        </Typography>
        <Typography variant="body1" gutterBottom>
          Scan a group QR code to retrieve all tickets for the group and check in guests individually or all at once.
        </Typography>
        {loading && <CircularProgress sx={{ mt: 4 }} />}
        {!loading && !groupGuests && <QrReader onScan={handleScan} />}
        {confirmation && (
          <ConfirmationPage
            status={confirmation.status}
            message={confirmation.message}
            error={confirmation.error}
            onBack={() => setConfirmation(null)}
          />
        )}
        {groupGuests && !confirmation && (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Guests in Group</Typography>
              <Button variant="contained" onClick={handleCheckInAll} size="small">Check In All</Button>
            </Stack>
            <List>
              {groupGuests.map((guest, idx) => (
                <div key={guest[1]}>
                  <ListItem
                    secondaryAction={
                      guest[5] === 'Yes'
                        ? <Button variant="outlined" size="small" disabled>Checked In</Button>
                        : <Button variant="contained" size="small" onClick={() => handleCheckIn(guest[1])}>Check In</Button>
                    }
                  >
                    <ListItemText
                      primary={guest[2]}
                      secondary={`Ticket ID: ${guest[1]} | Checked In: ${guest[5] === 'Yes' ? 'Yes' : 'No'}`}
                    />
                  </ListItem>
                  {idx < groupGuests.length - 1 && <Divider />}
                </div>
              ))}
            </List>
            <Button sx={{ mt: 2 }} onClick={() => setGroupGuests(null)}>Scan Another Group</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default GroupCheckIn;