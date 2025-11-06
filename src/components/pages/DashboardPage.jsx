import React, { useState, useEffect } from 'react';
import api from '../services/api';

// MUI Imports
import { Container, Grid, Typography, Alert } from '@mui/material';


import EventForm from '../EventForm';
import EventCard from '../EventCard';

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Callback to refresh event list after a new one is created
  const handleEventCreated = (newEvent) => {
    setEvents([ newEvent, ...events]);
  };
  
  // Callback to update UI after an event status is changed
  const handleEventUpdate = (updatedEvent) => {
    setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Left Side: Create Event Form */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Create New Event
          </Typography>
          <EventForm onEventCreated={handleEventCreated} />
        </Grid>

        {/* Right Side: My Events List */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            My Events
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {events.length === 0 ? (
            <Typography>You have no events. Create one!</Typography>
          ) : (
            <Grid container spacing={2}>
              {events.map((event) => (
                <Grid item xs={12} key={event._id}>
                  <EventCard event={event} onEventUpdate={handleEventUpdate} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;