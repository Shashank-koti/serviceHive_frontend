import React, { useState } from 'react';
import api from './services/api';
import { Box, TextField, Button, Alert } from '@mui/material';

const EventForm = ({ onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !startTime || !endTime) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/events', {
        title,
        startTime,
        endTime,
      });
      onEventCreated(res.data); // Pass new event up to parent
      // Clear form
      setTitle('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Event Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Start Time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <TextField
        label="End Time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Creating...' : 'Create Event'}
      </Button>
    </Box>
  );
};

export default EventForm;