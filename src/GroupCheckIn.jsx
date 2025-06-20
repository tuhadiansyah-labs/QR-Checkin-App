import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, Stack, CircularProgress } from '@mui/material';
import QrReader from './components/QrReader';
import ConfirmationPage from './components/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const GROUP_API_URL = 'https://getticketsbygroupid-4faso3ggca-uc.a.run.app';
const CHECKIN_API_URL = 'https://checkinticket-4faso3ggca-uc.a.run.app';

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
      setConfirmation({ status: 'error', message: 'Group ID not found in QR code!' });
      return;
    }
    setLoading(true);
    fetch(`${GROUP_API_URL}?groupId=${encodeURIComponent(groupId)}`)
      .then(res => res.json().then(result => ({ result, ok: res.ok })))
      .then(({ result, ok }) => {
        setLoading(false);
        if (ok && Array.isArray(result.tickets)) {
          setGroupGuests(result.tickets);
          setGroupId(groupId);
        } else {
          setGroupGuests([]);
          setGroupId(groupId);
          setConfirmation({ status: 'error', message: 'Group not found!', error: JSON.stringify(result) });
        }
      })
      .catch((err) => {
        setLoading(false);
        setConfirmation({ status: 'error', message: 'Network error.', error: err?.message });
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
    fetch(CHECKIN_API_URL, {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'SUCCESS' || data.status === 'PARTIAL_SUCCESS') {
          setConfirmation({ status: 'success', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
        } else if (data.status === 'ALREADY_CHECKEDIN') {
          setConfirmation({ status: 'error', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
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

  const handleCheckInAll = () => {
    if (!groupGuests) return;
    setLoading(true);
    fetch(CHECKIN_API_URL, {
      method: 'POST',
      body: JSON.stringify({ groupId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === 'SUCCESS') {
          setConfirmation({ status: 'success', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
        } else if (data.status === 'PARTIAL_SUCCESS') {
          setConfirmation({ status: 'success', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(groupId);
          }, 1500);
        } else if (data.status === 'NOT_FOUND') {
          setConfirmation({ status: 'error', message: data.message });
        } else if (data.status === 'ERROR') {
          setConfirmation({ status: 'error', message: data.message, error: JSON.stringify(data) });
        } else {
          setConfirmation({ status: 'error', message: 'Group check-in failed.', error: JSON.stringify(data) });
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
              {groupGuests.map((ticket, idx) => (
                <div key={ticket.ticketId}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      ticket.checkedIn === 'TRUE'
                        ? <Button variant="outlined" size="small" disabled>Checked In</Button>
                        : <Button variant="contained" size="small" onClick={() => handleCheckIn(ticket.ticketId)}>Check In</Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{ticket.name}</Typography>
                          <Typography variant="body2">Ticket ID: {ticket.ticketId}</Typography>
                          <Typography variant="body2">Checked In: {ticket.checkedIn === 'TRUE' ? 'Yes' : 'No'}</Typography>
                          {ticket.checkInTime && (
                            <Typography variant="body2">Time: {ticket.checkInTime}</Typography>
                          )}
                        </Box>
                      }
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