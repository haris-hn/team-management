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
import { gsap } from "gsap";
import apiClient from "../api/client";
import { useLocation } from "react-router-dom";
import { Delete, Edit, Add, RocketLaunch, TaskAlt } from "@mui/icons-material";

const ProjectCard = ({ project, onEdit, onDelete, index, allMembers }) => {
  const cardRef = useRef(null);

  // Find member details for display
  const assignedMembers = allMembers.filter((m) =>
    project.members?.includes(m._id),
  );

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.98, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
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
        borderRadius: 3,
        bgcolor: "#1e293b",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 22px 45px rgba(0, 0, 0, 0.45), 0 0 15px rgba(99, 102, 241, 0.15)",
          borderColor: "rgba(99, 102, 241, 0.4)",
          "& .manage-assets": { opacity: 1, transform: "translateX(0)" }
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 4, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Chip
            label={project.status === "active" ? "In Progress" : "Completed"}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              px: 0.5,
              height: 22,
              bgcolor: project.status === "active" ? "rgba(99, 102, 241, 0.12)" : "rgba(16, 185, 129, 0.12)",
              color: project.status === "active" ? "#a5b4fc" : "#6ee7b7",
              border: `1px solid ${project.status === "active" ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
            }}
          />
          <IconButton onClick={() => onDelete(project._id)} size="small" sx={{ color: "rgba(255,255,255,0.2)", "&:hover": { color: "error.main", bgcolor: "rgba(239, 68, 68, 0.1)" } }}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>

        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: "-0.5px", lineHeight: 1.3, mb: 1.5 }}>
          {project.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            mb: 4,
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "5.1em",
            fontSize: "0.925rem"
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            {project.techStack?.split(",").map((tech) => (
              <Chip
                key={tech}
                label={tech.trim()}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  bgcolor: "rgba(255,255,255,0.02)",
                  height: 24,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ opacity: 0.05, mb: 3 }} />

        {assignedMembers.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Team
              </Typography>
              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: "0.7rem", border: "2px solid #1e293b" } }}>
                {assignedMembers.map((m) => (
                  <Tooltip key={m._id} title={`${m.name} - ${m.role}`}>
                    <Avatar alt={m.name} src={m.avatar} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Stack>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, justifyContent: "space-between", alignItems: "center" }}>
        <Typography 
          variant="caption" 
          className="manage-assets"
          sx={{ 
            color: "rgba(255,255,255,0.3)", 
            fontWeight: 800, 
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            opacity: 0,
            transform: "translateX(-10px)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": { color: "primary.main" }
          }}
        >
          Manage Assets
        </Typography>
        <Button
          startIcon={<Edit sx={{ fontSize: "1rem !important" }} />}
          onClick={() => onEdit(project)}
          size="small"
          sx={{
            fontWeight: 800,
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            color: "primary.main",
            bgcolor: "rgba(99, 102, 241, 0.06)",
            "&:hover": { bgcolor: "rgba(99, 102, 241, 0.12)" },
          }}
        >
          Edit
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
        apiClient.get("/projects"),
        apiClient.get("/members"),
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
    // Blur current focus to prevent ARIA hidden warnings when modal opens
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await apiClient.put(`/projects/${editing}`, formData);
      } else {
        await apiClient.post("/projects", formData);
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
        await apiClient.delete(`/projects/${id}`);
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
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1.5px", mb: 1 }}>
            Project Management
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Overview of {projects.length} active projects
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
            No projects found
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", mb: 4 }}>
            There are currently no active projects in this workspace. Create a new one to begin tracking.
          </Typography>
          <Button variant="outlined" onClick={() => handleOpen()} size="large" sx={{ borderRadius: 3, px: 4 }}>
            Create First Project
          </Button>
        </Paper>
      )}

      <Grid container spacing={6}>
        {/* Active Projects Column */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 4, bgcolor: "rgba(99, 102, 241, 0.05)", border: "1px solid rgba(99, 102, 241, 0.1)" }}>
            <RocketLaunch sx={{ color: "primary.main" }} />
            <Typography variant="h5" fontWeight={900}>Active Execution</Typography>
            <Chip label={projects.filter(p => p.status === "active").length} size="small" sx={{ fontWeight: 800, bgcolor: "primary.main", color: "white" }} />
          </Box>
          <Grid container spacing={4}>
            {projects.filter(p => p.status === "active").map((proj, idx) => (
              <Grid size={{ xs: 12 }} key={proj._id} sx={{ display: "flex" }}>
                <ProjectCard
                  project={proj}
                  onEdit={handleOpen}
                  onDelete={handleDelete}
                  index={idx}
                  allMembers={members}
                />
              </Grid>
            ))}
            {projects.filter(p => p.status === "active").length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center", py: 4, border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 4 }}>
                  No active projects found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Completed Projects Column */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 4, bgcolor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
            <TaskAlt sx={{ color: "#34d399" }} />
            <Typography variant="h5" fontWeight={900}>Success & Archived</Typography>
            <Chip label={projects.filter(p => p.status === "completed").length} size="small" sx={{ fontWeight: 800, bgcolor: "#10b981", color: "white" }} />
          </Box>
          <Grid container spacing={4}>
            {projects.filter(p => p.status === "completed").map((proj, idx) => (
              <Grid size={{ xs: 12 }} key={proj._id} sx={{ display: "flex" }}>
                <ProjectCard
                  project={proj}
                  onEdit={handleOpen}
                  onDelete={handleDelete}
                  index={idx}
                  allMembers={members}
                />
              </Grid>
            ))}
            {projects.filter(p => p.status === "completed").length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center", py: 4, border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 4 }}>
                  No completed projects in the archive.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
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
          <DialogTitle sx={{ p: 4, pb: 2 }} component="div">
            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-1px" }}>
              {editing ? "Edit Project" : "New Project"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>
              Configure the project parameters and team assignments.
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
                <InputLabel sx={{ ml: 1 }}>Assign Team Members</InputLabel>
                <Select
                  multiple
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                  input={<OutlinedInput label="Assign Team Members" sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "none" }} />}
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
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects;
