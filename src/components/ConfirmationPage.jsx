import { Box, Typography, Button } from '@mui/material';

const SuccessSVG = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="48" fill="#4CAF50"/>
    <path d="M28 50L42 64L68 38" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorSVG = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="48" fill="#F44336"/>
    <path d="M32 32L64 64M64 32L32 64" stroke="#fff" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

export default function ConfirmationPage({ status, message, error, onBack }) {
  return (
    <Box sx={{
      minHeight: { xs: 320, sm: 400 },
      width: '100%',
      maxWidth: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      my: 'auto',
      py: 4,
      px: 2,
      textAlign: 'center',
      flex: 1
    }}>
      <Box sx={{ mb: 2 }}>
        {status === 'success' ? <SuccessSVG /> : <ErrorSVG />}
      </Box>
      <Typography variant="h5" fontWeight={700} gutterBottom align="center">
        {message}
      </Typography>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 1, wordBreak: 'break-all' }}>
          {error}
        </Typography>
      )}
      {onBack && (
        <Button variant="outlined" sx={{ mt: 3 }} onClick={onBack}>
          Back
        </Button>
      )}
    </Box>
  );
}