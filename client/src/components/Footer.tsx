import { Box, Typography } from '@mui/material';

const Footer = () => {

    return (
        <Box sx={{ borderTop: 1, borderColor: 'divider', padding: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            © 2023 SocialHolo. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Contact Us: QHq7F@example.com</a>
          </Typography>
        </Box>
    );
}

export default Footer;