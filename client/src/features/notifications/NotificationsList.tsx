import { useState } from 'react'
import classnames from 'classnames'
import { TimeAgo } from '../../components/TimeAgo'
import { PostAuthor } from '../../features/posts/PostAuthor'


// icons import
import NotificationsIcon from '@mui/icons-material/Notifications';

// components import
import { Drawer, List, IconButton, Box, Skeleton, Tooltip, Badge, ListItem, Typography, Card, CardContent, Avatar } from '@mui/material';

// rtk hooks import
import {
    useGetNotificationsQuery,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
    ServerNotification,
    apiSliceWithNotifications
  } from './notificationsSlice'
import { Link } from 'react-router-dom'
import { NotificationsCard } from './NotificationsCard';
import store from '../../app/store';

export const NotificationsList = ({data}: {data: ServerNotification}) => {

  const [isOpen, setIsOpen] = useState(false);

  // const dispatch = useAppDispatch()
  const {data: notifications=[], isLoading} = useGetNotificationsQuery()
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  // const notificationsMetadata = useAppSelector(selectMetadataEntities)

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    store.dispatch(apiSliceWithNotifications.util.updateQueryData('getNotifications', undefined, draft => {
      draft.unreadCount = 0;
    }))
    setIsOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 450 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ mt:2, ml:2 }}>Notifications</Typography>
      <List>
        { data.notifications.length > 0 
          ? data.notifications.map((notification, index) => (
              <NotificationsCard key={index} notification={notification} />
            ))
          : <>
            <Skeleton sx={{ m:2 }} variant="rectangular" width={400} height={"50px"}/>
            <Skeleton sx={{ m:2 }} variant="rectangular" width={400} height={"50px"}/>
          </>
        }
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton sx={{ mr: 1}} edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
        <Tooltip title="Notifications">
          <Badge badgeContent={data.unreadCount} color="info"> <NotificationsIcon sx={{ color: 'white' }} /> </Badge> 
        </Tooltip>
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)} 
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
  )
}
