import { Button, Typography, Box, Card, CardContent, Avatar, Grid, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PublicIcon from '@mui/icons-material/Public';
import bgHero from '../../public/bgHero.webp';

const Home = () => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: 3 }} >

      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: theme.palette.background.default,
          padding: 5,
          borderRadius: 2,
          boxShadow: 2,
          mb: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>Connect, Share, and Discover What Matters to You!</Typography>
        <Button variant="contained" color="primary" size="large">Join Now</Button>
      </Box>

      {/* Highlights Section */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 2, textAlign: 'center' }}>
            <ChatBubbleIcon fontSize="large" color="primary" />
            <Typography variant="h6">Instant Messaging</Typography>
            <Typography variant="body2">Connect with friends instantly.</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 2, textAlign: 'center' }}>
            <PublicIcon fontSize="large" color="secondary" />
            <Typography variant="h6">Global Connections</Typography>
            <Typography variant="body2">Engage with a global community.</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 2, textAlign: 'center' }}>
            <PersonIcon fontSize="large" color="success" />
            <Typography variant="h6">Share Moments</Typography>
            <Typography variant="body2">Post and share memorable moments.</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Testimonials Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom textAlign="center">What Our Users Say</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', padding: 2, alignItems: 'center' }}>
              <Avatar sx={{ marginRight: 2 }} src="https://randomuser.me/api/portraits/women/1.jpg" alt="User" />
              <CardContent>
                <Typography variant="body1">“I love the community here!”</Typography>
                <Typography variant="caption">- Sarah W.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', padding: 2, alignItems: 'center' }}>
              <Avatar sx={{ marginRight: 2 }} src="https://randomuser.me/api/portraits/men/2.jpg" alt="User" />
              <CardContent>
                <Typography variant="body1">“The features are fantastic!”</Typography>
                <Typography variant="caption">- Mark P.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Interactive Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>Join Thousands of Users Worldwide</Typography>
        <Typography variant="body2" color="textSecondary">Connect with people from over 100 countries!</Typography>
      </Box>
    </Box>
  );
};

export default Home;
