import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import {
  RocketLaunch,
  Groups,
  Assignment,
  Add,
  TrendingUp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import apiClient from "../api/client";

const StatCard = ({ title, count, icon, color, delay }) => {
  const cardRef = React.useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, delay, ease: "back.out(1.7)" },
      );
    }
  }, [delay]);

  return (
    <Card
      ref={cardRef}
      sx={{
        height: "100%",
        borderRadius: 4,
        bgcolor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: color,
          boxShadow: `0 0 20px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ mt: 1, mb: 1 }}>
              {count}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUp sx={{ fontSize: "1rem", color: "#34d399" }} />
              <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 700 }}>
                +12% this month
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    members: 0,
    active: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await apiClient.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 8,
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          mb: 6,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(99, 102, 241, 0.3)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={4}
          >
            <Box>
              <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: "-2px", color: "white", lineHeight: 1.1, mb: 2 }}>
                High-Velocity Project <br /> Management
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", mb: 4, maxWidth: 500, fontWeight: 500 }}>
                Track progress, manage teams, and scale your operations with the Nexus Pro development suite.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate("/projects", { state: { openNew: true } })}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 900,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  New Project
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/team")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "white",
                    fontWeight: 900,
                    borderRadius: 3,
                    px: 4,
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)" },
                  }}
                >
                  Manage Team
                </Button>
              </Stack>
            </Box>
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <RocketLaunch sx={{ fontSize: { lg: 200, xl: 240 }, color: "white", opacity: 0.15, transform: "rotate(15deg)" }} />
            </Box>
          </Stack>
        </Box>
        {/* Decorative elements */}
        <Box sx={{ position: "absolute", top: -50, right: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.1)", blur: "100px" }} />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Projects"
            count={stats.projects}
            icon={<Assignment />}
            color="#6366f1"
            delay={0.1}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Members"
            count={stats.members}
            icon={<Groups />}
            color="#a855f7"
            delay={0.2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="In-Progress"
            count={stats.active}
            icon={<RocketLaunch />}
            color="#ec4899"
            delay={0.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
