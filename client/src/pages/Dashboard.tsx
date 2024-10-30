import { useEffect, useState } from 'react';
import { Avatar, Grid, Typography, Container, Box, Skeleton, useMediaQuery, IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import UsersRecord from '../features/users/UsersRecord';
import PostCard from '../features/posts/PostCard';
import { AddPostForm } from '../features/posts/AddPostForm';
import { useGetPostsQuery } from '../features/api/apiSlice';
import { Spinner } from '../components/Spinner';
const Dashboard = () => {

  const [showButton, setShowButton] = useState(false);
  const { data, isLoading } = useGetPostsQuery();
  const isSmallmdScreen = useMediaQuery('(max-width:600px)');
  const users = [
    { name: 'Your Story', avatar: '/avatar1.jpg' },
    { name: 'Bob Frappes', avatar: '/avatar2.jpg' },
    { name: 'Greta Life', avatar: '/avatar3.jpg' },
  ];

  // Monitor scrolling to toggle button visibility
  useEffect(() => {
    const gridElement = document.getElementById('scrollableGrid');
    
    const handleScroll = () => {
      if (gridElement?.scrollTop && gridElement?.scrollTop > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    gridElement?.addEventListener('scroll', handleScroll);

    return () => {
      gridElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle scroll to top
  const handleScrollTop = () => {
    const gridElement = document.getElementById('scrollableGrid');
    gridElement?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) { 
    return <Spinner text={"Fetching... Posts"} />;
  }
  if(!data){
    return <Skeleton variant="rectangular" width="100%" height="100%" />
  }
  const posts = data.posts || [];
  const publicPosts = data.publicPosts || [];
  return (
    <Container maxWidth='xl' sx={{height: '100%'}}>
      <Grid container spacing={2} height={'100%'}>
        {/* First Box */}
        <Grid id="scrollableGrid" item xl={7} xs={12} sm={12} md={7} overflow={'auto'} sx={{ height: '100%', overflow: 'auto' }}>
          <Box>
            <Box>
              {/* Stories section
              <Box display="flex" gap={2} mb={3}>
                {users.map((user, index) => (
                  <Box key={index} display="flex" flexDirection="column" alignItems="center">
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 80, height: 80 }} />
                    <Typography>{user.name}</Typography>
                  </Box>
                ))}
              </Box> */}
              
              {/* Add Post Section */}
              <AddPostForm />
              
              {/* Feed Section */}
              <Box>
                { posts
                  ? posts.map((post) => (
                    <PostCard post={post} key={post.id} />
                  ))
                  : <Box> No Posts Available </Box>
                }
              </Box>

              {/* Public Posts Section */}
              <Box>
                { publicPosts && publicPosts.length > 0 && <Typography variant="h6" sx={{ mb: 2 }}>Suggested Posts</Typography> }
                { publicPosts
                  ? publicPosts.map((post) => (
                    <PostCard post={post} key={post.id} />
                  ))
                  : <Box> No Public Posts Available </Box>
                }
              </Box>
            </Box>
          </Box>
          {/* Go to Top Button */}
          {showButton && (
            <IconButton
              onClick={handleScrollTop}
              sx={{
                position: 'sticky',
                bottom: 16,
                left: '100%',
                zIndex: 1000,
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          )}
        </Grid>
        { !isSmallmdScreen && 
          <Grid item xl={5} md={5} sx={{ height: '100%' }}>
              <UsersRecord listName={"Suggestions"} />
          </Grid>
        }
      </Grid>
    </Container>
  );
};

export default Dashboard;
