import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Alert,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  AvatarGroup,
  Avatar,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";
import { Add, Edit, Delete, RocketLaunch, GroupAdd } from "@mui/icons-material";
import { gsap } from "gsap";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ProjectCard = ({ project, onEdit, onDelete, index, allMembers }) => {
  const cardRef = useRef(null);

  // Find member details for display
  const assignedMembers = allMembers.filter((m) =>
    project.members?.includes(m._id),
  );

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
      },
    );
  }, [index]);

  return (
    <Card
      ref={cardRef}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 5,
        bgcolor: "#1e293b",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.1)",
          borderColor: "rgba(99, 102, 241, 0.3)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Chip
            label={project.status === "active" ? "In Progress" : "Completed"}
            size="small"
            sx={{
              fontWeight: 900,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              bgcolor: project.status === "active" ? "rgba(99, 102, 241, 0.15)" : "rgba(16, 185, 129, 0.15)",
              color: project.status === "active" ? "#818cf8" : "#34d399",
              border: `1px solid ${project.status === "active" ? "rgba(99, 102, 241, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
            }}
          />
          <IconButton onClick={() => onDelete(project._id)} size="small" sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "error.main" } }}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>

        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          {project.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            mb: 4,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "4.8em",
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1, letterSpacing: "1px" }}>
            Stack
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            {project.techStack?.split(",").map((tech) => (
              <Chip
                key={tech}
                label={tech.trim()}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  bgcolor: "rgba(255,255,255,0.03)",
                }}
              />
            ))}
          </Stack>
        </Box>

        {assignedMembers.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 800, textTransform: "uppercase", display: "block", mb: 1.5, letterSpacing: "1px" }}>
              Collaborators
            </Typography>
            <AvatarGroup max={4} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 32, height: 32, fontSize: "0.8rem", border: "2px solid #1e293b" } }}>
              {assignedMembers.map((m) => (
                <Tooltip key={m._id} title={`${m.name} - ${m.role}`}>
                  <Avatar alt={m.name} src={m.avatar} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </CardContent>

      <Divider sx={{ opacity: 0.05 }} />

      <CardActions sx={{ p: 2, px: 3, justifyContent: "space-between" }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
          Manage Assets
        </Typography>
        <Button
          startIcon={<Edit />}
          onClick={() => onEdit(project)}
          size="small"
          sx={{
            fontWeight: 800,
            textTransform: "none",
            color: "primary.main",
            "&:hover": { bgcolor: "rgba(99, 102, 241, 0.1)" },
          }}
        >
          Adjust Scope
        </Button>
      </CardActions>
    </Card>
  );
};

const Projects = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    status: "active",
    members: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Check if we should open the "New Project" dialog automatically
    if (location.state?.openNew) {
      handleOpen();
      // Clear state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const [projRes, memRes] = await Promise.all([
        axios.get("https://team-management-production-22c4.up.railway.app/projects"),
        axios.get("https://team-management-production-22c4.up.railway.app/members"),
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
      setEditing(proj._id);
      setFormData({
        title: proj.title,
        description: proj.description,
        techStack: proj.techStack,
        status: proj.status,
        members: proj.members || [],
      });
    } else {
      setEditing(null);
      setFormData({
        title: "",
        description: "",
        techStack: "",
        status: "active",
        members: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`https://team-management-production-22c4.up.railway.app/projects/${editing}`, formData);
      } else {
        await axios.post("https://team-management-production-22c4.up.railway.app/projects", formData);
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(`https://team-management-production-22c4.up.railway.app/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 6, mt: 2, gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1.5px", mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}>
            Project Hub
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Managing {projects.length} active workstreams
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 4,
            px: 4,
            py: 1.5,
            fontWeight: 900,
            boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
            textTransform: "none",
            fontSize: "1rem",
            width: { xs: "100%", sm: "auto" }
          }}
        >
          New Project
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ borderRadius: 2, mb: 4, height: 4, bgcolor: "rgba(255,255,255,0.05)" }} />}

      {!loading && projects.length === 0 && (
        <Paper
          sx={{
            p: { xs: 4, md: 10 },
            textAlign: "center",
            borderRadius: 8,
            border: "2px dashed rgba(255,255,255,0.1)",
            bgcolor: "transparent",
          }}
        >
          <RocketLaunch sx={{ fontSize: 80, color: "primary.main", opacity: 0.3, mb: 3 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready for takeoff?
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", mb: 4 }}>
            Your workspace is currently empty. Start by defining your first high-impact project.
          </Typography>
          <Button variant="outlined" onClick={() => handleOpen()} size="large" sx={{ borderRadius: 3, px: 4 }}>
            Initialize Workspace
          </Button>
        </Paper>
      )}

      <Grid container spacing={4}>
        {projects.map((proj, idx) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={proj._id} sx={{ display: "flex" }}>
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

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 6,
            bgcolor: "#0f172a",
            backgroundImage: "none",
            border: "1px solid rgba(255,255,255,0.08)",
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ p: 4, pb: 2 }}>
            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-1px" }}>
              {editing ? "Refine Workstream" : "New Workstream"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>
              Define the technological parameters and team alignment.
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Stack spacing={4} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Project Title"
                variant="filled"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <TextField
                fullWidth
                label="Mission Statement / Overview"
                multiline
                rows={4}
                variant="filled"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <TextField
                fullWidth
                label="Primary Technology Stack"
                placeholder="e.g. React, Node.js, GSAP"
                variant="filled"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />

              <FormControl fullWidth variant="filled">
                <InputLabel sx={{ ml: 1 }}>Assign Domain Experts</InputLabel>
                <Select
                  multiple
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                  input={<OutlinedInput label="Assign Domain Experts" sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "none" }} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={members.find((m) => m._id === value)?.name || value}
                          size="small"
                          sx={{ borderRadius: 1, fontWeight: 700 }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem key={member._id} value={member._id} sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={member.avatar} sx={{ width: 24, height: 24 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{member.name}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.5 }}>{member.role}</Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                select
                fullWidth
                label="Strategic Status"
                variant="filled"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              >
                <MenuItem value="active">Active Execution</MenuItem>
                <MenuItem value="completed">Success/Archived</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 0 }}>
            <Button onClick={handleClose} sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
              Discard
            </Button>
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ borderRadius: 3, px: 6, fontWeight: 900, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)" }}
            >
              {editing ? "Save Refinements" : "Initialize Workstream"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
