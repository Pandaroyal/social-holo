import { Box } from "@mui/material";

// Profile Tabs Content (Posts, IGTV, Tagged, etc.)
export const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number}) => {
    return (
      <div hidden={value !== index} style={{ height: '100%'}}>
        {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
      </div>
    );
  };