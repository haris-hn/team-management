import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
  Fade,
} from "@mui/material";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = ({ isRegister = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formRef = useRef(null);
  const titleRef = useRef(null);
  const fieldsRef = useRef([]);

  useEffect(() => {
    // Check for success message from registration redirect
    if (location.state?.message) {
      setSuccess(location.state.message);
    }

    const tl = gsap.timeline();
    tl.fromTo(
      formRef.current,
      { opacity: 0, scale: 0.9, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "expo.out" },
    );
    tl.fromTo(
      titleRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6 },
      "-=0.6",
    );
    tl.fromTo(
      fieldsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      "-=0.4",
    );
  }, [isRegister, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isRegister) {
      const result = await register(name, email, password);
      if (result.success) {
        // Redirect to login after register as requested
        navigate("/login", {
          state: {
            message: "Registration successful! Please sign in to continue.",
          },
        });
      } else {
        setError(result.message);
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "30vw",
          height: "30vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          ref={formRef}
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 6,
            bgcolor: "rgba(99, 102, 241, 0.15)",
            color: "#0f172a",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            ref={titleRef}
            variant="h3"
            gutterBottom
            fontWeight={900}
            sx={{ letterSpacing: "-1px", color: "#000000" }}
          >
            {isRegister ? "Create Account" : "Nexus Login"}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, opacity: 0.8, color: "#000000" }}
            fontWeight={500}
          >
            {isRegister
              ? "Join the future of project management."
              : "Enter your workspace credentials."}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {isRegister && (
                <TextField
                  inputRef={(el) => (fieldsRef.current[0] = el)}
                  fullWidth
                  label="Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}
                />
              )}
              <TextField
                inputRef={(el) => (fieldsRef.current[isRegister ? 1 : 0] = el)}
                fullWidth
                label="Email"
                type="email"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}
              />
              <TextField
                inputRef={(el) => (fieldsRef.current[isRegister ? 2 : 1] = el)}
                fullWidth
                label="Password"
                type="password"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}
              />
              <Button
                ref={(el) => (fieldsRef.current[isRegister ? 3 : 2] = el)}
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  bgcolor: "#0f172a",
                  "&:hover": { bgcolor: "#334155" },
                }}
              >
                {isRegister ? "Get Started" : "Sign In Now"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.8, color: "#000000" }}>
              {isRegister ? "Already an expert? " : "New here? "}
              <Button
                variant="text"
                onClick={() => {
                  setSuccess(null);
                  navigate(isRegister ? "/login" : "/register");
                }}
                sx={{
                  color: "#6366f1",
                  fontWeight: 800,
                  p: 0,
                  minWidth: "auto",
                  ml: 0.5,
                }}
              >
                {isRegister ? "Sign In" : "Create Account"}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
