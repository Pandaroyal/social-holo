import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, useTheme, Skeleton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { showError } from '../../utils/helper';
import { useChangePasswordMutation } from '../users/usersSlice';
import { toast } from 'react-hot-toast';

interface ChangePasswordFormFields extends HTMLFormControlsCollection {
  password: HTMLInputElement
  new_password: HTMLInputElement
  confirm_password: HTMLInputElement
}
interface ChangePasswordFormElements extends HTMLFormElement {
  readonly elements: ChangePasswordFormFields
}

export const Privacy = () => {
    const theme = useTheme();
    const user = useAppSelector(state => state.auth.user);
    const [open, setOpen] = useState(false); // State to control form visibility
    const [changePassword, {error}] = useChangePasswordMutation();
    // Function to open the form (dialog)
    const handleOpen = () => {
      setOpen(prev => !prev);
    };
  
    // Function to close the form (dialog)
    const handleClose = () => {
      console.log("handle closed")
      setOpen(prev => !prev);
    };

    const handleFormSubmit = async (event: React.FormEvent<ChangePasswordFormElements>) => {
      console.log("form handle");
      event.preventDefault()

      const { elements } = event?.currentTarget
      const password = elements?.password?.value
      const new_password = elements?.new_password?.value
      const confirm_password = elements?.confirm_password.value
      
      
      if(password && new_password && confirm_password){
        if(new_password !== confirm_password){
          showError("new password and confirm password do not match");
        }
        try {
          toast.promise( 
            changePassword({password, new_password}).unwrap(), // Dispatch the signup action
            {
              loading: 'Changing...',
              success: <b>Password Changed</b>,
              error: <b>Incorrect Password</b>,
            }
          );
          handleClose();
        } catch (error) {
          console.error("Signup failed:", error); // Handle signup failure
          showError("signup failed");
        }
      } else {
        showError("All fields are required."); // Log if any field is empty
        // Optionally display a warning message to the user
      }
    }

    return (
      <Box p={2}>
        <Typography variant="h4" mb={2}>Account</Typography>
        {/* Settings List with Switches */}
        <List sx={{ flexGrow: 1, width: '100%' }}>
            { user
              ? <>
                  <ListItem
                    key={'change_password'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      marginBottom: 2,
                      padding: "10px 20px",
                      borderRadius: 2,
                      width: '100%',
                      cursor: 'pointer'
                    }}
                    onClick={handleOpen} // Open form on click
                  >
                    <ListItemText primary={"Change Password"} />                    
                  </ListItem>
                  {/* Dialog Form */}
                  <Dialog fullWidth open={open} onClose={handleClose}>
                    <DialogTitle>Change Password</DialogTitle>
                   {/* Wrap everything inside a form */}
                    <form onSubmit={handleFormSubmit}>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='password'
                          label="Current Password"
                          type="password"
                          required
                          fullWidth
                        />
                      </DialogContent>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='new_password'
                          label="New Password"
                          type="text"
                          required
                          fullWidth
                        />
                      </DialogContent>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='confirm_password'
                          label="Confirm Password"
                          type="password"
                          required
                          fullWidth
                        />
                      </DialogContent>
                      <Alert severity="error" id='signup-error' sx={{ mx: 2, padding: 2, display: 'none' }}></Alert>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        <Button color="primary" type="submit">Submit</Button>
                      </DialogActions>
                    </form>  
                  </Dialog>
                </>
              : <Skeleton variant="rectangular" width="100%" height={60} />
            }
        </List>
      </Box>
    )
}