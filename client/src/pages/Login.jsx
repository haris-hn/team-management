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
  const location = useLocation();
  const [success, setSuccess] = useState(location.state?.message || null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const formRef = useRef(null);
  const titleRef = useRef(null);
  const fieldsRef = useRef([]);

  useEffect(() => {
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
        justifyContent: "center",
        background: "#0f172a",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Animated Background Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: { xs: "80vw", md: "40vw" },
          height: { xs: "80vw", md: "40vw" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: { xs: "70vw", md: "30vw" },
          height: { xs: "70vw", md: "30vw" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          ref={formRef}
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 8,
            bgcolor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              ref={titleRef}
              variant="h3"
              fontWeight={900}
              sx={{ letterSpacing: "-1.5px", color: "white", mb: 1 }}
            >
              {isRegister ? "Create Account" : "Sign In"}
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              {isRegister ? "Join the Nexus Pro platform." : "Access your secure dashboard."}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {isRegister && (
                <TextField
                  inputRef={(el) => (fieldsRef.current[0] = el)}
                  fullWidth
                  label="Display Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{ sx: { borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" } }}
                />
              )}
              <TextField
                inputRef={(el) => (fieldsRef.current[isRegister ? 1 : 0] = el)}
                fullWidth
                label="Email Address"
                type="email"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{ sx: { borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <TextField
                inputRef={(el) => (fieldsRef.current[isRegister ? 2 : 1] = el)}
                fullWidth
                label="Secure Password"
                type="password"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{ sx: { borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" } }}
              />
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: 900,
                  borderRadius: 3,
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
                  mt: 1,
                }}
              >
                {isRegister ? "Register" : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <Button
                variant="text"
                onClick={() => navigate(isRegister ? "/login" : "/register")}
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  p: 0,
                  minWidth: "auto",
                  textTransform: "none",
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                {isRegister ? "Sign In" : "Sign Up"}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
