import React, { useEffect, useState } from 'react';
import { fetchUsers, toggleAdminStatus, deleteUser } from '../services/api';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Switch } from '@mui/material';
import { Delete } from '@mui/icons-material';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId, isAdmin) => {
    await toggleAdminStatus(userId, isAdmin);
    setUsers(users.map(user => user._id === userId ? { ...user, admin: !isAdmin } : user));
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
    setUsers(users.filter(user => user._id !== userId));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Manage Users</Typography>
      <List>
        {users.map(user => (
          <ListItem key={user._id} divider>
            <ListItemText primary={user.username} secondary={`Name: ${user?.firstName} ${user?.lastName}`} />
            <Switch checked={user.admin} onChange={() => handleToggleAdmin(user._id, user.admin)} />
            <IconButton onClick={() => handleDeleteUser(user._id)} color="error">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ManageUsers;
