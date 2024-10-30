import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { useGetNotificationsQuery } from '../features/notifications/notificationsSlice';
import { socketService } from '../socket/socket';
import { useTheme } from '@emotion/react';
import { Logout as LogoutIcon } from '@mui/icons-material';

// material ui components
import { AppBar, Toolbar, Typography, Box, Link as MuiLink, Switch, styled, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import { resetApiState } from '../features/api/apiSlice';
import { NotificationsList } from '../features/notifications/NotificationsList';

type headerProps = {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

export const Header = ({toggleDarkMode}: headerProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { data, isSuccess, refetch } = useGetNotificationsQuery();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  // UseEffect to trigger refetch when the user changes (e.g., on login/logout)
  useEffect(() => {
    if (user) {
      // Refetch when a user logs in or changes
      refetch();
    }
  }, [user, refetch]);

  const onLogoutClicked = () => {
    dispatch(logout());
    socketService.disconnect();
    dispatch(resetApiState());
  };

  let navContent: React.ReactNode = null;

  if (user) {

    navContent = (
      <Box display="flex" justifyContent="end" alignItems="center" sx={{height: 'content'}}>
        <Toolbar className="flex items-center">
            { isSmallScreen ? '' : <img width={30} height={30} className='rounded-full' src={user.avatar} alt="" /> } &nbsp;
            { isSmallScreen ? '' : <Typography sx={{ mr: 2 }} className="font-bold"> Hi, {user.name}!</Typography> }
            {data && <NotificationsList data={data}/> }
            <Tooltip title="Logout" followCursor>
              <IconButton onClick={onLogoutClicked} size="small" color="error"> <LogoutIcon /> </IconButton>
            </Tooltip>
            <MaterialUISwitch defaultChecked onClick={toggleDarkMode} />
        </Toolbar>
      </Box>
    );
  }else{
    navContent = (
      <Box display="flex" justifyContent="end" alignItems="center" sx={{height: 'content'}}>
        <Toolbar sx={{height: 'content'}}>
            <MuiLink component={Link} to="/login" underline='none' color='white' sx={{ padding: '5px 10px' }}>
              Login
            </MuiLink>
            <MuiLink component={Link} to="/signup" underline='none' color='white' sx={{ padding: '5px 10px' }}>
              Signup
            </MuiLink>
            <MaterialUISwitch defaultChecked onClick={toggleDarkMode} />
        </Toolbar>
      </Box>
    ) 
  }

  return (
    <Box  sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          { user && <Sidebar /> }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SocialHolo
          </Typography>
          {navContent}
        </Toolbar>
      </AppBar>
    </Box>
  );
};