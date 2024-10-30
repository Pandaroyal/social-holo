import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// components import
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Box, useTheme } from '@mui/material';

// icons import
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Search as SearchIcon } from '@mui/icons-material'
import SettingsIcon from '@mui/icons-material/Settings';

// hooks imports
import { useAppSelector } from '../app/hooks';
import { selectCurrentUserId } from '../features/auth/authSlice';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const theme = useTheme();
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const sidebarItems = [
    { text: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Search', icon: <SearchIcon />, link: '/search' },
    { text: 'Profile', icon: <AccountCircleIcon />, link: `/profile/${currentUserId}` },
    { text: 'Settings', icon: <SettingsIcon />, link: '/settings/account' },
  ];

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {sidebarItems.map((item, index) => (
          <ListItem component={Link} to={item.link}  key={index} sx={{ '&:hover': { backgroundColor: `${theme.palette.action.hover}` }}}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            top: '64px', // Adjust to your header height (64px for default MUI AppBar height)
            height: 'calc(100% - 64px)', // Adjust the height to account for the header
          },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default Sidebar;
