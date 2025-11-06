import React, { useState }from 'react';
import api from './services/api';

// MUI Imports
import { Card, CardContent, Typography, Button, Box, Chip, Alert } from '@mui/material';

const EventCard = ({ event, onEventUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Helper to format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusChip = () => {
    let color = 'default';
    if (event.status === 'SWAPPABLE') color = 'success';
    if (event.status === 'SWAP_PENDING') color = 'warning';
    return <Chip label={event.status} color={color} size="small" />;
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/events/${event._id}`, {
        status: newStatus,
      });
      onEventUpdate(res.data); // Pass updated event to parent
    } catch (err) {
       setError(err.response?.data?.message || 'Failed to update status');
    }
    setLoading(false);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{event.title}</Typography>
          {getStatusChip()}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {formatDate(event.startTime)} – {formatDate(event.endTime)}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

        <Box sx={{ mt: 2 }}>
          {event.status === 'BUSY' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleStatusChange('SWAPPABLE')}
              disabled={loading}
            >
              Make Swappable
            </Button>
          )}
          {event.status === 'SWAPPABLE' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleStatusChange('BUSY')}
              disabled={loading}
            >
              Make Busy
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;