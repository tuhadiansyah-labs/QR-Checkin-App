import { Container, Typography, Box, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Stack } from '@mui/material';
import QrReader from './components/QrReader';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyQYn55b6Wn3JfV9bqzOPbzzWQQKt8d3G3d21osYCNHR-BQE_pnx_jWlvW7U3gwIhdj/exec';

function extractGroupId(qrText) {
  const match = qrText.match(/Group:\s*(.+)/);
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

  const handleCheckIn = (ticketId) => {
    setLoading(true);
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(result => {
        setLoading(false);
        if (result.status === 'success' || result.status === 'already_checked_in') {
          // Refresh group data
          handleScan(groupId);
        } else {
          alert('Check-in failed.');
        }
      })
      .catch(() => {
        setLoading(false);
        alert('Network error.');
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
        {!groupGuests && <QrReader onScan={handleScan} />}
        {loading && <Typography sx={{ mt: 2 }}>Loading...</Typography>}
        {groupGuests && (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Guests in Group</Typography>
              <Button variant="contained" onClick={handleCheckInAll} size="small">Check In All</Button>
            </Stack>
            <List>
              {groupGuests.map((guest, idx) => (
                <div key={guest[1]}>
                  <ListItem>
                    <ListItemText
                      primary={guest[2]}
                      secondary={`Ticket ID: ${guest[1]} | Checked In: ${guest[5] === 'Yes' ? 'Yes' : 'No'}`}
                    />
                    <ListItemSecondaryAction>
                      {guest[5] === 'Yes' ? (
                        <Button variant="outlined" size="small" disabled>Checked In</Button>
                      ) : (
                        <Button variant="contained" size="small" onClick={() => handleCheckIn(guest[1])}>Check In</Button>
                      )}
                    </ListItemSecondaryAction>
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