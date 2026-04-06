import React, { useEffect, useRef } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Container, useTheme, Fade } from '@mui/material';
import { Dashboard, Folder, People, Logout, Menu } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

const drawerWidth = 260;

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const mainRef = useRef(null);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Projects', icon: <Folder />, path: '/projects' },
    { text: 'Team', icon: <People />, path: '/team' },
  ];

  useEffect(() => {
    // GSAP Page Transition
    gsap.fromTo(mainRef.current, 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          ml: { sm: `${drawerWidth}px)` },
          bgcolor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Workspace'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>{user?.name}</Typography>
              <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontWeight: 800, fontSize: '0.9rem' }}>
                {user?.name?.[0]}
              </Avatar> 
            </Stack>
            <IconButton onClick={logout} color="inherit" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
              <Logout fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#1e293b',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            backgroundImage: 'none'
          },
        }}
      >
        <Toolbar sx={{ px: 3, mt: 1 }}>
          <Typography variant="h5" color="primary" fontWeight={900} sx={{ letterSpacing: '-1.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{ width: 12, height: 12, bgcolor: 'secondary.main', borderRadius: '50%' }} />
            NEXUS
          </Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto', mt: 4, px: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text} 
                disablePadding
                sx={{ mb: 1.5 }}
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                   sx={{
                    borderRadius: 3,
                    py: 1.2,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                      '& .MuiListItemIcon-root': { color: 'white' },
                      '&:hover': { bgcolor: 'primary.dark' }
                    },
                    '&:hover:not(.Mui-selected)': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        ref={mainRef}
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          mt: 9, 
          minHeight: '100vh',
          bgcolor: '#0f172a'
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

// Internal component for Stack since we didn't import it
const Stack = ({ children, direction = 'row', spacing = 1, alignItems = 'center', sx = {} }) => (
  <Box sx={{ display: 'flex', flexDirection: direction, gap: spacing * 8, alignItems, ...sx }}>
    {children}
  </Box>
);

export default Layout;
