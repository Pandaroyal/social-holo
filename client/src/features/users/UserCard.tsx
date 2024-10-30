import { Avatar, Button, Card, CardContent, Grid, ListItem, ListItemAvatar, Typography, useMediaQuery } from '@mui/material';
import { Followers, useFollowMutation, useRequestAcceptMutation, useUnfollowMutation } from './usersSlice';
import { useAppSelector } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { selectCurrentUserId } from '../auth/authSlice';

export const UserCard = (user: Followers) => {

    let currentUserId = useAppSelector(selectCurrentUserId);
    const [follow] = useFollowMutation();
    const [unfollow] = useUnfollowMutation();
    const [ accept ] = useRequestAcceptMutation();
    const isSmall = useMediaQuery('(max-width:600px)');
    return (
      <ListItem key={user.id}>
        <Card sx={{ 
          display: 'flex', 
          width: '100%',
          padding: 1,
        }}>
          <Grid container sx={{
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Grid sx={{ minWidth: '250px', maxWidth: '100%', width: "60%", flexGrow: 1, display: 'flex', alignItems: 'center', paddingLeft: 2 }}>
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 64, height: 64, margin: 2 }} />
              </ListItemAvatar>
              <CardContent component={Link} to={`/profile/${user.id}`}>
                <Typography variant="h6" color="textSecondary">{user.username}</Typography>
                <Typography variant="body1">{user.name}</Typography>
              </CardContent>
            </Grid>
            { !user?.requestId
              ? <Grid sx={{ minWidth: '120px', maxWidth: '100%', width: '40%', flexGrow: 1, flexShrink: 0, display: 'flex', justifyContent: 'end', alignItems: 'center', justifySelf: 'end' }}>
                { currentUserId !== user.id && (
                    !user.followStatus
                    ? <Button variant="outlined" onClick={() => follow(user.id as string)} sx={{ marginRight: 1 }}>
                        Follow
                      </Button>
                    : user.followStatus.isAccepted == true
                    ? <Button variant="outlined" onClick={() => user.followStatus && unfollow(user.followStatus.id as string)} sx={{ marginRight: 1 }}>
                        Unfollow
                      </Button> 
                    : <Button variant="outlined" onClick={() => user.followStatus && unfollow(user.followStatus.id as string)} sx={{ marginRight: 1 }}>
                        Requested
                      </Button> 
                  )                                        
                }
              </Grid>
              : <Grid sx={ isSmall ? { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', justifySelf: 'end', paddingRight: 2 }}>
                    <Button variant="outlined" onClick={() => user.requestId && accept(user.requestId as string)} color="error" sx={{ marginRight: 1 }}>
                      Accept
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => user.requestId && unfollow(user.requestId as string)} sx={{ marginRight: 1 }}>
                      Decline
                    </Button> 
                </Grid>
            }
          </Grid>
        </Card>
      </ListItem>
    )
}