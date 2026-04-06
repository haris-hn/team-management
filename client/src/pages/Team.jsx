import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Delete, Edit, GroupAdd, PersonAdd } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { gsap } from "gsap";
import axios from "axios";

const Team = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", role: "", email: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
  });
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    fetchMembers();
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        "https://team-management-production-22c4.up.railway.app/members",
      );
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, color = "success") => {
    setSnackbar({ open: true, message, color });
  };

  const handleOpen = (member = null) => {
    if (member) {
      setEditing(member._id);
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email,
      });
    } else {
      setEditing(null);
      setFormData({ name: "", role: "", email: "" });
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
        await axios.put(
          `https://team-management-production-22c4.up.railway.app/members/${editing}`,
          formData,
        );
        showNotification("Member profile updated!");
      } else {
        await axios.post(
          "https://team-management-production-22c4.up.railway.app/members",
          formData,
        );
        showNotification("New member added to the roster!");
      }
      fetchMembers();
      handleClose();
    } catch (err) {
      console.error(err);
      showNotification("Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this member from the roster?")) {
      try {
        await axios.delete(
          `https://team-management-production-22c4.up.railway.app/members/${id}`,
        );
        showNotification("Member removed", "error");
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ height: "100%" }}>
          <Avatar src={params.row.avatar} sx={{ width: 32, height: 32, bgcolor: "primary.main", fontWeight: 800, fontSize: "0.8rem" }}>
            {params.value?.[0]}
          </Avatar>
          <Typography fontWeight={700}>{params.value}</Typography>
        </Stack>
      ),
    },
    { 
      field: "role", 
      headerName: "Role", 
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    { field: "email", headerName: "Contact", minWidth: 200, flex: 1 },
    {
      field: "actions",
      headerName: "Operations",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Tooltip title="Edit Profile">
            <IconButton
              onClick={() => handleOpen(params.row)}
              size="small"
              sx={{ color: "primary.main", bgcolor: "rgba(99, 102, 241, 0.1)" }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Member">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              size="small"
              sx={{ color: "error.main", bgcolor: "rgba(239, 68, 68, 0.1)" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const MobileMemberCard = ({ member }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 4,
        bgcolor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar 
            src={member.avatar} 
            sx={{ width: 48, height: 48, mr: 2, bgcolor: "primary.main", fontWeight: 800 }}
          >
            {member.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>{member.name}</Typography>
            <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700 }}>{member.role}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", display: "block", mb: 0.5 }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>{member.email}</Typography>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.05 }} />

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<Edit />}
            onClick={() => handleOpen(member)}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={() => handleDelete(member._id)}
            sx={{ borderRadius: 2, fontWeight: 700, borderColor: "rgba(239, 68, 68, 0.2)" }}
          >
            Remove
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box ref={containerRef} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: { xs: 4, md: 6 },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-1.5px", mb: 1 }}>
            Team Management
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Overview of {members.length} team members
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 4,
            px: 4,
            py: 1.5,
            fontWeight: 900,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
            width: { xs: "100%", sm: "auto" }
          }}
        >
          Add Member
        </Button>
      </Box>

      {isMobile ? (
        <Box sx={{ pb: 4 }}>
          {members.length > 0 ? (
            members.map((member) => (
              <MobileMemberCard key={member._id} member={member} />
            ))
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
                No team members found.
              </Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <Paper
          sx={{
            height: 650,
            width: "100%",
            bgcolor: "#1e293b",
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <DataGrid
            rows={members}
            getRowId={(row) => row._id}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            rowHeight={70}
            sx={{
              border: "none",
              color: "rgba(255,255,255,0.8)",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "rgba(255, 255, 255, 0.02)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 800,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "1px",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              },
              "& .MuiDataGrid-virtualScroller": {
                bgcolor: "transparent",
              },
            }}
          />
        </Paper>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        fullScreen={isMobile}
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
              {editing ? "Edit Member" : "Add Team Member"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>
              Configure member details and roles.
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Stack spacing={4} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Full Professional Name"
                variant="filled"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <TextField
                fullWidth
                label="Strategic Role / Title"
                variant="filled"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <TextField
                fullWidth
                label="Communication Email"
                type="email"
                variant="filled"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
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
              {editing ? "Save Changes" : "Add Member"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          severity={snackbar.color} 
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Team;
