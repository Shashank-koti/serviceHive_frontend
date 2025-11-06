import React, { useState, useEffect } from 'react';
import api from './services/api';

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

const RequestSwapModal = ({ open, onClose, targetSlot }) => {
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMySlotId, setSelectedMySlotId] = useState(null);
  
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchMySwappableSlots = async () => {
        setLoading(true);
        try {
          const res = await api.get('/events'); // Fetches all *my* events
          const swappable = res.data.filter(
            (event) => event.status === 'SWAPPABLE'
          );
          setMySlots(swappable);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch your slots');
        }
        setLoading(false);
      };
      fetchMySwappableSlots();
    }
  }, [open]);

  const handleConfirmSwap = async () => {
    setRequestLoading(true);
    setError('');
    
    try {
      await api.post('/swap/request', {
        mySlotId: selectedMySlotId,
        theirSlotId: targetSlot._id,
      });
      setRequestLoading(false);
      onClose(true); // Pass 'true' to indicate success
    } catch (err) {
      setError(err.response?.data?.message || 'Swap request failed');
      setRequestLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>Request a Swap</DialogTitle>
      <DialogContent>
        <Typography variant="h6">You want:</Typography>
        <Typography gutterBottom>
          {targetSlot.title} ({formatDate(targetSlot.startTime)})
        </Typography>
        <hr />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Offer one of your swappable slots:
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
            <RadioGroup
              aria-label="my-slot"
              name="my-slot-group"
              value={selectedMySlotId}
              onChange={(e) => setSelectedMySlotId(e.target.value)}
            >
              {mySlots.length > 0 ? (
                mySlots.map((slot) => (
                  <FormControlLabel
                    key={slot._id}
                    value={slot._id}
                    control={<Radio />}
                    label={`${slot.title} (${formatDate(slot.startTime)})`}
                  />
                ))
              ) : (
                <Typography>You have no swappable slots to offer.</Typography>
              )}
            </RadioGroup>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button
          onClick={handleConfirmSwap}
          variant="contained"
          disabled={!selectedMySlotId || loading || requestLoading}
        >
          {requestLoading ? 'Sending...' : 'Confirm Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestSwapModal;