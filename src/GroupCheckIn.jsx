import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, Stack, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import QrReader from './components/QrReader';
import ConfirmationPage from './components/ConfirmationPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  const [lastScannedQrText, setLastScannedQrText] = useState('');

  // Helper to check if all guests are checked in
  const allCheckedIn = groupGuests && groupGuests.length > 0 && groupGuests.every(ticket => ticket.checkedIn === 'TRUE');

  const handleScan = (qrText) => {
    setLastScannedQrText(qrText);
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
        if (ok && Array.isArray(result.tickets) && result.tickets.length > 0) {
          setGroupGuests(result.tickets);
          setGroupId(groupId);
        } else {
          setGroupGuests(null);
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
            handleScan(lastScannedQrText);
          }, 1500);
        } else if (data.status === 'ALREADY_CHECKEDIN') {
          setConfirmation({ status: 'error', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(lastScannedQrText);
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
            handleScan(lastScannedQrText);
          }, 1500);
        } else if (data.status === 'PARTIAL_SUCCESS') {
          setConfirmation({ status: 'success', message: data.message });
          setTimeout(() => {
            setConfirmation(null);
            handleScan(lastScannedQrText);
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
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" disableGutters sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', px: { xs: 0, sm: 2 }, width: '100%' }}>
        <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/')} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
              Group Check-In
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 2, minHeight: 0 }}>
          {(!groupGuests && !confirmation && !loading) && (
            <Typography variant="body1" gutterBottom align="center" sx={{ mx: { xs: 2, sm: 4 } }}>
              Scan a group QR code to retrieve all tickets for the group and check in guests individually or all at once.
            </Typography>
          )}
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
            <Box sx={{ mt: 3, flex: 1, width: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, ml: 2, mr: 2 }}>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Guests in Group
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (allCheckedIn) {
                      setConfirmation({ status: 'success', message: 'All guests are already checked in!' });
                    } else {
                      handleCheckInAll();
                    }
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                  disabled={allCheckedIn}
                >
                  Check In All
                </Button>
              </Stack>
              <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', width: '100%' }}>
                <List sx={{ width: '100%' }}>
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
                              <Typography variant="subtitle1" fontWeight={600}>Registrant: {ticket.name}</Typography>
                              <Typography variant="body2">Email: {ticket.email}</Typography>
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
              </Box>
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 3, ml: 2, mr: 2, py: 2, fontSize: '1.1rem', borderRadius: 2 }}
                onClick={() => setGroupGuests(null)}
              >
                Scan Another Group
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default GroupCheckIn;