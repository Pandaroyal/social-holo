import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useFollowMutation, useUnfollowMutation, useGetUserQuery, useRequestAcceptMutation, AccountType } from '../users/usersSlice';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Grid, Tab, Typography, Button, Container, Drawer, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { Spinner } from '../../components/Spinner';
import UsersRecord from '../users/UsersRecord';
import { CustomTabs } from '../../components/CustomTabs';
import { Lock as LockIcon, MoreVert as MoreIcon } from '@mui/icons-material'
import { TabPanel } from '../../components/TabPanel';
import { useGetUserPostsQuery } from '../api/apiSlice';
import PostCard from '../posts/PostCard';
import { Post } from '../posts/postsSlice';
import { selectCurrentUserId } from '../auth/authSlice';
import { UsersListType } from '../../utils/constants';

const Profile = () => {
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  let currentUserId = useAppSelector(selectCurrentUserId);
  
  const open = Boolean(anchorEl);
  let userId = location.pathname.split('/')[2];

  const { data: user } = useGetUserQuery(userId as string);
  const { data: posts } = useGetUserPostsQuery(userId as string);
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();
  const [accept] = useRequestAcceptMutation();
  
  const postsWithImages = posts && posts.filter(post => post.media);
  const postContent: ReactNode | ReactNode[] = ( 
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {posts && posts.length > 0
        ? posts.map( (post: Post) => 
            <PostCard key={post.id} post={post} />
          )
        : <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No Posts yet
          </Typography>
      }
    </Box>
    )

  // Close sidebar when the URL changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]); // Detect URL change using `asPath`

  if(!user){
    return (
        <Spinner text="Loading profile..."/>
    )
  }

  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const canSee = () => {
    return ( user.id === currentUserId 
      || ( user?.followStatus && user.followStatus.isAccepted == true ) 
      || user.account_type === AccountType.PUBLIC ) 
  }

  // Open Drawer for "Followers" or "Following"
  const handleOpenDrawer = (content: string) => {
    if( !canSee() || ( (content === UsersListType.FOLLOWERS && user.followers_count === 0) || (content === UsersListType.FOLLOWINGS && user.followings_count === 0))) return;
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth='lg' sx={{ height: '100%', overflowY: 'auto'}}>
      {/* Profile Header Section */}
      <Box display="flex" alignItems="center" px={3} py={2}>
        <Avatar
          src="/profile-avatar.jpg"
          alt="Profile"
          sx={{ width: 100, height: 100, mr: 4 }}
        />
        <Box flexGrow={1}>
          {/* Stats: Posts, Followers, Following */}
          <Box display="flex" gap={3} mb={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
              <strong>{user.posts_count}</strong> 
              <Typography>posts</Typography>
            </Box>
            <Box onClick={() => handleOpenDrawer(UsersListType.FOLLOWERS)} sx={{ cursor: `${canSee() && user.followers_count ? 'pointer' : 'default'}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <strong>{user.followers_count}</strong> 
              <Typography>followers</Typography>
            </Box>
            <Box onClick={() => handleOpenDrawer(UsersListType.FOLLOWINGS)} sx={{ cursor:  `${canSee() && user.followings_count ? 'pointer' : 'default'}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <strong>{user.followings_count}</strong> 
              <Typography>following</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box px={3}>
        {/* Username and Follow Button */}
        <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h5" fontWeight="bold">
              {user.username} {user.account_type === AccountType.PRIVATE && <LockIcon sx={{ color: 'gray', fontSize: 16 }}/>}
            </Typography>
        </Box>
        {/* Bio */}
        <Typography>
            <strong>{user.name}</strong>
        </Typography>
        <Typography mb={2}>{user.bio}</Typography>
        <Box display="flex" gap={2}>
          { currentUserId === userId
            ? <Button variant="contained">
                Edit Profile
              </Button>
              
            : <> 
                <>
                  { 
                    user?.isFollowing && user.isFollowing?.isAccepted == false && 
                    <>
                      <Button variant="contained" color='success' onClick={() => user.isFollowing && accept(user.isFollowing.id as string)}>
                        Accept
                      </Button>
                      <Button variant="contained" color='error' onClick={() => user.isFollowing && unfollow(user.isFollowing.id as string)}>
                        Decline
                      </Button>
                    </>
                  }
                </>
                <>
                  { 
                    !user.followStatus
                    ? <Button variant="contained" onClick={() => follow(userId as string)}>
                        { user?.isFollowing && user.isFollowing?.isAccepted == true ? 'Follow Back' : 'Follow' } 
                      </Button>
                    : user.followStatus.isAccepted == true
                      ? <Button variant="contained" onClick={() => user.followStatus && unfollow(user.followStatus.id as string)}>
                          UnFollow
                        </Button>        
                      : <Button variant="contained" color='info' onClick={() => user.followStatus && unfollow(user.followStatus.id as string)}>
                          Requested
                        </Button>
                  }
              </>
            </>
          }
          <IconButton onClick={handleClick}>
            <MoreIcon />
          </IconButton> 
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Share Profile</MenuItem>
            <MenuItem onClick={handleClose}>Block</MenuItem>
            <MenuItem onClick={handleClose}>Report</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Tabs (Posts, Reels, Tagged) */}
      <Box borderBottom={1} borderColor="divider" 
        sx={{ position: 'sticky', top: 0, backgroundColor: theme.palette.background.paper, zIndex: 10, borderBottom: 1, borderColor: 'divider' }}
      >
        <CustomTabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Posts" />
          <Tab label="Reels" />
          {/* <Tab label="Tagged" /> */}
        </CustomTabs>
      </Box>

      {/*Posts Tab Panels */}
      <TabPanel value={tabIndex} index={0}>
        {postContent}
      </TabPanel>

      {/*Reels Tab Panels */}
      <TabPanel value={tabIndex} index={1}>
        <Grid container spacing={1} sx={{ mt: 2, height: '100%', overflowY: 'auto'}}>
          { postsWithImages && postsWithImages.length > 0  
              ? postsWithImages.map( post =>
                  <Grid item xs={4} key={post.id}>
                    <Box
                      component="img"
                      src={post.media[0].url}
                      alt="Post Image"
                      sx={{ width: '100%', height: 'auto' }}
                    />
                  </Grid>
                )
              : <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                  No Images yet
                </Typography>
          }
        </Grid>
      </TabPanel>

      {/*Tagged Tab Panels */}
      {/* <TabPanel value={tabIndex} index={2}>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No Tagged posts yet
        </Typography>
      </TabPanel> */}

      {/* Drawer for Followers/Following List */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer} 
        sx={{
          '& .MuiDrawer-paper': {
            top: '64px', // Adjust to your header height (64px for default MUI AppBar height)
            height: 'calc(100% - 64px)', // Adjust the height to account for the header
          },
        }}
      >
        <Box sx={{ width: 500, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <UsersRecord listName={drawerContent} type={drawerContent} id={userId}/>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Profile;
