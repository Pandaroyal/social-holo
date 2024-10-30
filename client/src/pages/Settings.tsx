import { useState } from 'react';
import { Box, List, ListItemText, Drawer, IconButton, useMediaQuery, ListItem, Tooltip } from '@mui/material';
import { MenuOpen as MenuOpenIcon, AccountCircle as AccountCircleIcon, PrivacyTip as PrivacyTipIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link, Outlet } from 'react-router-dom';
import { Relation } from '@mswjs/data/lib/relations/Relation';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Sidebar Options
  const sidebarOptions = [
    { label: 'Account', icon: <AccountCircleIcon sx={{ ml : 1, mr : 2 }} />, to: '/settings/account', },
    { label: 'Privacy', icon: <PrivacyTipIcon sx={{ ml : 1, mr : 2 }} />, to: '/settings/privacy', },
    { label: 'Notifications', icon: <NotificationsIcon sx={{ ml : 1, mr : 2 }} />, to: '/settings/notifications', },
  ];

  // Handle sidebar menu toggle for small screens
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant='permanent'
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: isSmallScreen ? '70px' : '240px',
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: isSmallScreen ? '70px' : '240px',
            boxSizing: 'border-box', 
            top: '70px', // Adjust to your header height (64px for default MUI AppBar height)
            height: 'calc(100% - 64px)', // Adjust the height to account for the header },
          },
        }}
      >
        {/* <IconButton onClick={toggleSidebar} sx={sidebarOpen ? { width: '40px', position: 'relative', left: '220px' } : {}}>
          <MenuOpenIcon sx={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
        </IconButton> */}
        <List >
          {sidebarOptions.map((option, index) => (
            <ListItem
              component={Link}
              key={option.label}
              to={option.to}
            >
              <Tooltip title={option.label} followCursor>
                {option.icon}
              </Tooltip>
              <ListItemText primary={option.label} sx={{ ml: 1 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Sidebar Toggle Button */}
      {/* {isSmallScreen && (
        <IconButton onClick={toggleSidebar} sx={{ width: '40px', height: '40px', position: 'relative', top: '5px', left: '80%' }}>
          <MoreVert />
        </IconButton>
      )} */}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
          <Outlet />
      </Box>
    </Box>
  );
};

export default Settings;
