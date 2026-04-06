import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Paper, Stack, Button, IconButton } from '@mui/material';
import { gsap } from 'gsap';
import { TrendingUp, Groups, Assignment, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, index }) => {
  const cardRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 50, rotateX: -20 }, 
      { opacity: 1, y: 0, rotateX: 0, duration: 1, delay: index * 0.1, ease: 'expo.out' }
    );

    // Count up animation
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      delay: index * 0.1 + 0.5,
      ease: 'power4.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.innerText = Math.ceil(obj.val);
      }
    });
  }, [value, index]);

  return (
    <Paper
      ref={cardRef}
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 6,
        bgcolor: 'rgba(255, 255, 255, 0.9)', // "White background" for contrast
        color: '#0f172a',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          bgcolor: '#ffffff'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ opacity: 0.8, color: '#000000' }}>
          {title.toUpperCase()}
        </Typography>
        <Box sx={{ bgcolor: `${color}22`, p: 1.5, borderRadius: 3, color: color, display: 'flex' }}>
          {icon}
        </Box>
      </Box>
      <Typography ref={numRef} variant="h2" fontWeight={900} sx={{ mt: 3, letterSpacing: '-2px', color: '#000000' }}>
        0
      </Typography>
    </Paper>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ projects: 0, members: 0, active: 0, completed: 0 });
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const svgPathRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, memRes] = await Promise.all([
          axios.get('http://localhost:5000/projects'),
          axios.get('http://localhost:5000/members')
        ]);
        
        const projects = projRes.data;
        setStats({
          projects: projects.length,
          members: memRes.data.length,
          active: projects.filter(p => p.status === 'active').length,
          completed: projects.filter(p => p.status === 'completed').length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();

    // Enhanced hero animations
    gsap.fromTo(heroTextRef.current, 
      { y: 60, opacity: 0, skewY: 5 }, 
      { y: 0, opacity: 1, skewY: 0, duration: 1.5, ease: 'expo.out' }
    );
    gsap.fromTo(heroSubRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 2, delay: 0.8, ease: 'power2.out' }
    );

    // SVG Liquid Path Animation
    gsap.to(svgPathRef.current, {
      attr: { d: "M40,100 C40,40 160,40 160,100 C160,160 40,160 40,100" },
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  const statItems = [
    { title: 'Total Projects', value: stats.projects, icon: <Assignment fontSize="large" />, color: '#6366f1' },
    { title: 'Team Members', value: stats.members, icon: <Groups fontSize="large" />, color: '#ec4899' },
    { title: 'Active Flow', value: stats.active, icon: <TrendingUp fontSize="large" />, color: '#f59e0b' },
    { title: 'Archived', value: stats.completed, icon: <CheckCircle fontSize="large" />, color: '#10b981' },
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
        <Stack spacing={2} sx={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <Typography ref={heroTextRef} variant="h1" fontWeight={900} sx={{ lineHeight: 0.9 }}>
            Design <span style={{ color: '#6366f1' }}>Fast</span>.<br />
            Ship <span style={{ color: '#ec4899' }}>Sleek</span>.
          </Typography>
          <Typography ref={heroSubRef} variant="h5" color="text.secondary" sx={{ mt: 3, maxWidth: 600, opacity: 0.8 }} fontWeight={500}>
            Experience a full-stack workspace where project velocity meets high-fidelity design aesthetics.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/projects', { state: { openNew: true } })}
              sx={{ py: 2, px: 5, borderRadius: 4, fontWeight: 900 }}
            >
              Create Project
            </Button>
            <Button variant="outlined" size="large" sx={{ py: 2, px: 5, borderRadius: 4, fontWeight: 900 }}>Analytics</Button>
          </Stack>
        </Stack>

        <Box sx={{ position: 'absolute', top: -50, right: 0, width: '50%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
           <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            <path 
              ref={svgPathRef}
              fill="none" 
              stroke="#6366f1" 
              strokeWidth="0.5"
              d="M30,100 C30,30 170,30 170,100 C170,170 30,170 30,100" 
            />
          </svg>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        {statItems.map((item, index) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...item} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
