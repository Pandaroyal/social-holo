import { ListItem, Card, CardContent, Avatar, Typography, Box, Skeleton, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { TimeAgo } from '../../components/TimeAgo';
import { Notification } from './notificationsSlice';
import { useGetUserQuery } from '../users/usersSlice';
import { useGetPostQuery } from '../api/apiSlice';
import { useReadMutation } from './notificationsSlice';

export const NotificationsCard = ({notification}: {notification: Notification}) => {
    const theme = useTheme();
    const { data: post, isSuccess: postSuccess } = useGetPostQuery(notification.postId);
    const { data: user } = useGetUserQuery(notification.actorId);
    const [read] = useReadMutation();
    if( !user) {
        return <Skeleton sx={{ m:2 }} variant="rectangular" width={400} height={"50px"}/>
    }
    function createNotificationMessage() {
        const actorName = user ? <Link to={'/profile/'+notification.actorId} onClick={() => read(notification.id)} style={{ color: theme.palette.primary.main }}>@{user.username}</Link>: "Someone";
        switch (notification.type) {
          case "follow":
              return <>{actorName} started following you</>
          case "request":
              return <>{actorName} requested to follow you</>
          case "accept":
              return <>{actorName} accepted your follow request</>
          case "post-added":
              return <>{actorName} added a post</>
          case "like":
              return <>{actorName} liked your post</>
          case "comment":
              return <>{actorName} commented on your post</>
          case "reply":
              return <>{actorName} replied to your comment</>
          case "share":
              return <>{actorName} shared your post</>
          default:
              return "";
        }
    }

    return (
        <ListItem key={0} >
          <Card sx={{ 
            width:"400px", 
            backgroundColor: `${notification.readAt == true && (theme.palette.mode == 'dark' ? '#313131' : "#e3e3e3")}`
          }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <Box sx={{ width: "85%", display: "flex", alignItems: "center", gap: 1}}>
                <Link to={'/profile/'+notification.actorId} onClick={() => read(notification.id)}><Avatar src={user.avatar} aria-label="user-avatar" sx={{ width: "50px", height: "50px" }} /></Link>
                <Box sx={{ wdith: "100%"}}>
                  <Typography variant="body2" sx={{
                     display: "-webkit-box",
                     WebkitBoxOrient: "vertical",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     WebkitLineClamp: 2, // Limits it to 2 lines
                     whiteSpace: "normal", // Ensures the text can break into multiple lines
                  }}>{createNotificationMessage()}</Typography>
                  <TimeAgo timestamp={notification.createdAt} />
                </Box>
              </Box>
              { postSuccess ? 
                post && 
                  <Link to={'/posts/'+notification.postId} onClick={() => read(notification.id)} > 
                    <Avatar src={post.media && post.media[0].url} aria-label="user-avatar" sx={{ width: "50px", height: "50px", borderRadius: 0 }} /> 
                  </Link>
                : <Skeleton variant="circular" width={40} height={40} />
              }
            </CardContent>
          </Card>
        </ListItem>
    )
}