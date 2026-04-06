import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Stack, Avatar, IconButton, Alert, Snackbar
} from '@mui/material';
import { Add, Delete, Edit, GroupAdd } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { gsap } from 'gsap';
import axios from 'axios';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', color: 'success' });
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const snackRef = useRef(null);

  useEffect(() => {
    fetchMembers();
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/members');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, color = 'success') => {
    setSnackbar({ open: true, message, color });
    const tl = gsap.timeline();
    tl.fromTo(".MuiSnackbar-root", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out' });
  };

  const handleOpen = (member = null) => {
    if (member) {
      setEditing(member._id); // Use _id for MongoDB
      setFormData({ name: member.name, role: member.role, email: member.email });
    } else {
      setEditing(null);
      setFormData({ name: '', role: '', email: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/members/${editing}`, formData);
        showNotification('Member updated successfully!');
      } else {
        await axios.post('http://localhost:5000/members', formData);
        showNotification('Member added successfully!');
      }
      fetchMembers();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`http://localhost:5000/members/${id}`);
        showNotification('Member removed', 'error');
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={params.row.avatar} sx={{ width: 32, height: 32 }}>{params.value?.[0]}</Avatar>
          <Typography fontWeight={600}>{params.value}</Typography>
        </Stack>
      )
    },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleOpen(params.row)} color="primary" size="small"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)} color="error" size="small"><Delete /></IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box ref={containerRef} sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="primary">Team Directory</Typography>
        <Button variant="contained" color="secondary" startIcon={<GroupAdd />} onClick={() => handleOpen()} sx={{ boxShadow: 3 }}>
          Add Member
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <DataGrid
          rows={members}
          getRowId={(row) => row._id} // Tell DataGrid to use _id
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }}
        />
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle fontWeight={800} sx={{ color: 'primary.main' }}>
            {editing ? 'Edit Member' : 'New Team Member'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                fullWidth label="Full Name" value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} required 
              />
              <TextField 
                fullWidth label="Role / Title" value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} required 
              />
              <TextField 
                fullWidth label="Email" type="email" value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} required 
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button variant="contained" color="secondary" type="submit">
              {editing ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.color} sx={{ borderRadius: 2, boxShadow: 6 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Team;
