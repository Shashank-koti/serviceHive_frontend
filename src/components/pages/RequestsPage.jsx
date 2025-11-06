import React, { useState, useEffect } from 'react';
import api from '../services/api';

// MUI Imports
import { Container, Grid, Typography, Alert, Card, CardContent, CardActions, Button, CircularProgress, Box, Chip } from '@mui/material';

const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Track which button is loading

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Use Promise.all to fetch both in parallel
      const [incRes, outRes] = await Promise.all([
        api.get('/swap/requests/incoming'),
        api.get('/swap/requests/outgoing'),
      ]);
      setIncoming(incRes.data);
      setOutgoing(outRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accepted) => {
    setActionLoading(requestId);
    try {
      await api.post(`/swap/response/${requestId}`, { accepted });
      // Refresh all requests
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to respond to request');
    }
    setActionLoading(null);
  };
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusChip = (status) => {
    let color = 'default';
    if (status === 'ACCEPTED') color = 'success';
    if (status === 'REJECTED') color = 'error';
    if (status === 'PENDING') color = 'info';
    return <Chip label={status} color={color} size="small" />;
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Swap Requests
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={4}>
        {/* INCOMING REQUESTS */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Incoming
          </Typography>
          {incoming.length === 0 ? (
            <Typography>No incoming requests.</Typography>
          ) : (
            incoming.map((req) => (
              <Card variant="outlined" sx={{ mb: 2 }} key={req._id}>
                <CardContent>
                  <Typography variant="body1">
                    <b>{req.requester.name}</b> wants to swap:
                  </Typography>
                  <Typography><b>Their Slot:</b> {req.requesterSlot.title} ({formatDate(req.requesterSlot.startTime)})</Typography>
                  <Typography><b>Your Slot:</b> {req.recipientSlot.title} ({formatDate(req.recipientSlot.startTime)})</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled={actionLoading === req._id}
                    onClick={() => handleResponse(req._id, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={actionLoading === req._id}
                    onClick={() => handleResponse(req._id, false)}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Grid>

        {/* OUTGOING REQUESTS */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Outgoing
          </Typography>
          {outgoing.length === 0 ? (
            <Typography>No outgoing requests.</Typography>
          ) : (
            outgoing.map((req) => (
              <Card variant="outlined" sx={{ mb: 2 }} key={req._id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      To: <b>{req.recipient.name}</b>
                    </Typography>
                    {getStatusChip(req.status)}
                  </Box>
                  <Typography><b>Your Offer:</b> {req.requesterSlot.title} ({formatDate(req.requesterSlot.startTime)})</Typography>
                  <Typography><b>Their Slot:</b> {req.recipientSlot.title} ({formatDate(req.recipientSlot.startTime)})</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default RequestsPage;