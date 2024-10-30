import {styled, Tabs} from "@mui/material";

export const CustomTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
      textTransform: 'none', // Disable text transform
      fontWeight: 'normal', // Default weight
    },
    '& .css-1o2m8mo-MuiButtonBase-root-MuiTab-root.Mui-selected': {
      fontWeight: 'bold', // Bold font for selected tab
      color: theme.palette.secondary.main, // Change color of selected tab
      borderBottom: `5px solid ${theme.palette.secondary.main}` // Border for selected tab
    },
    '& .MuiTab-root:hover': {
      color: theme.palette.secondary.main, // Change color on hover
    },
  }));