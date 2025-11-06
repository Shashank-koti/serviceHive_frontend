import React, { useState, useEffect } from 'react';
import api from '../services/api';

// MUI Imports
import { Container, Grid, Typography, Alert, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';

// Child Component (we will create this next)
import RequestSwapModal from '../RequestSwapModal';

const MarketplacePage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modalx
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // The slot a user wants

  const fetchSwappableSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/swap/swappable-slots');
      setSlots(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch swappable slots');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const handleOpenModal = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = (swapInitiated = false) => {
    setModalOpen(false);
    setSelectedSlot(null);
    if (swapInitiated) {
      // Re-fetch slots to remove the one just requested
      fetchSwappableSlots();
    }
  };
  
  // Helper to format dates for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Marketplace
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {slots.length === 0 && !loading ? (
        <Typography>No swappable slots available right now.</Typography>
      ) : (
        <Grid container spacing={2}>
          {slots.map((slot) => (
            <Grid item xs={12} sm={6} key={slot._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{slot.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(slot.startTime)} – {formatDate(slot.endTime)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Owner: {slot.owner.name} ({slot.owner.email})
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleOpenModal(slot)}
                  >
                    Request Swap
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* The Modal */}
      {selectedSlot && (
        <RequestSwapModal
          open={modalOpen}
          onClose={handleCloseModal}
          targetSlot={selectedSlot}
        />
      )}
    </Container>
  );
};

export default MarketplacePage;