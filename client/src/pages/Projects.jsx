import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  MenuItem, IconButton, Stack, Alert, LinearProgress, Select, FormControl, InputLabel, OutlinedInput, AvatarGroup, Avatar, Tooltip, Paper
} from '@mui/material';
import { Add, Edit, Delete, RocketLaunch, GroupAdd } from '@mui/icons-material';
import { gsap } from 'gsap';
import axios from 'axios';

const ProjectCard = ({ project, onEdit, onDelete, index, allMembers }) => {
  const cardRef = useRef(null);
  
  // Find member details for display
  const assignedMembers = allMembers.filter(m => project.members?.includes(m._id));

  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, scale: 0.9, y: 10 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: index * 0.05, ease: 'power3.out' }
    );
  }, [index]);

  return (
    <Card 
      ref={cardRef} 
      sx={{ 
        height: 420, // Fixed height for equal cards
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 4, 
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(99, 102, 241, 0.2)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip 
            label={project.status.toUpperCase()} 
            color={project.status === 'active' ? 'primary' : 'success'} 
            size="small" 
            sx={{ fontWeight: 800, px: 1 }}
          />
          <IconButton onClick={() => onDelete(project._id)} size="small" color="error" sx={{ opacity: 0.7 }}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
        
        <Typography 
          variant="h5" 
          fontWeight={800} 
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {project.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 0 // Prevent text from taking up all space
          }}
        >
          {project.description}
        </Typography>

        <Stack spacing={2} sx={{ mt: 'auto' }}>
          <Box>
             <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
              TECH STACK
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {project.techStack?.split(',').map(tech => (
                <Chip key={tech} label={tech.trim()} variant="outlined" size="small" sx={{ borderRadius: 1 }} />
              ))}
            </Stack>
          </Box>

          {assignedMembers.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>
                TEAM
              </Typography>
              <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                {assignedMembers.map(m => (
                  <Tooltip key={m._id} title={`${m.name} - ${m.role}`}>
                    <Avatar alt={m.name} src={m.avatar} sx={{ width: 30, height: 30 }} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        <Button 
          startIcon={<Edit />} 
          onClick={() => onEdit(project)} 
          size="small"
          sx={{ fontWeight: 700 }}
        >
          Edit Details
        </Button>
      </CardActions>
    </Card>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', techStack: '', status: 'active', members: [] });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, memRes] = await Promise.all([
        axios.get('http://localhost:5000/projects'),
        axios.get('http://localhost:5000/members')
      ]);
      setProjects(projRes.data);
      setMembers(memRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (proj = null) => {
    if (proj) {
      setEditing(proj._id); // Use _id
      setFormData({ 
        title: proj.title, 
        description: proj.description, 
        techStack: proj.techStack, 
        status: proj.status,
        members: proj.members || [] 
      });
    } else {
      setEditing(null);
      setFormData({ title: '', description: '', techStack: '', status: 'active', members: [] });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/projects/${editing}`, formData);
      } else {
        await axios.post('http://localhost:5000/projects', formData);
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight={900} color="primary">Project Showcase</Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2, px: 3 }}
        >
          New Project
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ borderRadius: 2, mb: 4, height: 6 }} />}

      {!loading && projects.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed rgba(255,255,255,0.1)', bgcolor: 'transparent' }}>
          <RocketLaunch sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No projects active yet.</Typography>
          <Button variant="text" onClick={() => handleOpen()} sx={{ mt: 1 }}>Launch your first project</Button>
        </Paper>
      )}

      <Grid container spacing={3}>
        {projects.map((proj, idx) => (
          <Grid item xs={12} sm={6} md={4} key={proj._id}>
            <ProjectCard 
              project={proj} 
              onEdit={handleOpen} 
              onDelete={handleDelete} 
              index={idx} 
              allMembers={members}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ p: 3, pb: 1 }}>
            <Typography variant="h5" fontWeight={800}>{editing ? 'Edit Project Details' : 'Launch New Project'}</Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField 
                autoFocus fullWidth label="Project Title" 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required 
              />
              <TextField 
                fullWidth label="Overview" multiline rows={3} 
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required 
              />
              <TextField 
                fullWidth label="Tech Stack" placeholder="e.g. React, Mongoose, GSAP"
                value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} 
              />
              
              <FormControl fullWidth>
                <InputLabel>Assign Team Members</InputLabel>
                <Select
                  multiple
                  value={formData.members}
                  onChange={(e) => setFormData({...formData, members: e.target.value})}
                  input={<OutlinedInput label="Assign Team Members" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={members.find(m => m._id === value)?.name || value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField 
                select fullWidth label="Operational Status" 
                value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <MenuItem value="active">Active Execution</MenuItem>
                <MenuItem value="completed">Success/Archived</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button variant="contained" type="submit" size="large">{editing ? 'Update Project' : 'Deploy Project'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
