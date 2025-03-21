import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, Box, CircularProgress,
  Dialog, DialogContent, DialogActions, FormControlLabel, TextField, Switch
 } from "@mui/material";
import axios from "axios";
import { Add } from "@mui/icons-material";
const API_URL = "https://chemacademy.onrender.com";
const Community = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    isPrivate: false
  })
  const handleRoomData = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  }
  const handleCreateRoom = () => {
    const storedToken = localStorage.getItem("token");
    axios.post(`${API_URL}/rooms`,{headers:{
      Authorization: `Bearer ${storedToken}`
    }}, roomData) // Replace with your API endpoint
      .then(response => {
        setRooms([...rooms, response.data]);
        setRoomModalOpen(false);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error creating room:", error);
      });
  }
  useEffect(() => {
    axios.get("/api/rooms") // Replace with your API endpoint
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      });
  }, []);

  const handleJoin = (roomId, isPrivate) => {
    if (isPrivate) {
      alert("Request to join sent!");
      // Call API to send join request
    } else {
      alert("Joined room successfully!");
      // Call API to join the room instantly
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight='600'>Community Rooms</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => setRoomModalOpen(true)}><Add/>Create Room</Button>
      {loading ? <CircularProgress /> : (
        <Grid container spacing={3}>
          {rooms.map(room => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{room.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{room.description}</Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    sx={{ mt: 2 }}
                    onClick={() => handleJoin(room._id, room.isPrivate)}
                  >
                    {room.isPrivate ? "Request to Join" : "Join"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={roomModalOpen} onClose={() => setRoomModalOpen(false)} maxWidth='md' fullWidth>
        <Typography variant="h4" sx={{padding:'15px'}}>Add a new Room</Typography>
        <DialogContent>
          <Box sx={{display:'flex', flexDirection:'column', gap:'15px', width:'60%'}}>
            <TextField
              label="Room Name"
              name="name"
              value={roomData.name}
              onChange={handleRoomData}
            ></TextField>
            <TextField
              label="Room Details"
              multiline
              rows={4}
              name="description"
              value={roomData.description}
              onChange={handleRoomData}
            ></TextField>
          </Box>
          <FormControlLabel 
            control={<Switch checked={roomData.isPrivate} onChange={(e) => setRoomData({...roomData, isPrivate: e.target.checked})} />} 
            label="Private Room" 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoomModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateRoom}>Create Room</Button>
        </DialogActions>
      </Dialog>
    </Container>

  );
};

export default Community;
