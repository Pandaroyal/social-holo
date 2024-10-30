import { Box, Typography, List, ListItem, ListItemText, Switch, useTheme, Skeleton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material';
import { AccountType, useSwitchAccountTypeMutation, useUpdateUserMutation } from '../users/usersSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeAccountType, updateUser } from '../auth/authSlice';
import { useState } from 'react';
import { showError, toastDisplay } from '../../utils/helper';
import { toast } from 'react-hot-toast';

interface EditUserFormFields extends HTMLFormControlsCollection {
  name: HTMLInputElement
  username: HTMLInputElement
  email: HTMLInputElement
  bio: HTMLInputElement  
}
interface EditUserFormElements extends HTMLFormElement {
  readonly elements: EditUserFormFields
}

export const Account = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const [open, setOpen] = useState(false); // State to control form visibility
    const [editForm, setEditForm] = useState(false);
    const [switchAccountType] = useSwitchAccountTypeMutation();
    const [update, {isError, isLoading, isSuccess}] = useUpdateUserMutation();
    
    // Function to open the form (dialog)
    const handleOpen = () => {
      console.log("handle open")
      setOpen(prev => !prev);
    };
  
    // Function to close the form (dialog)
    const handleClose = () => {
      console.log("handle closed")
      setOpen(prev => !prev);
      editForm && setEditForm(prev => !prev)
    };

    const handleSwitch = () => {
      if(!user) return;
      switchAccountType(user.id);
      if(AccountType.PRIVATE === user.account_type){
        dispatch(changeAccountType(AccountType.PUBLIC));
      }else{
        dispatch(changeAccountType(AccountType.PRIVATE));
      }
    }

    const handleFormSubmit = async (event: React.FormEvent<EditUserFormElements>) => {
      console.log("form handle");
      event.preventDefault()

      const { elements } = event?.currentTarget
      const name = elements?.name?.value
      const username = elements?.username?.value
      const email = elements?.email.value
      const bio = elements?.bio.value

      if(user && name === user.name && username === user.username && email === user.email && bio === user.bio){
        setEditForm(prev => !prev);
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/;
      if(email && !emailRegex.test(email)){
        elements.email.focus();
        showError("invalid email");
        return;
      }
      
      if(user && name && username && email && bio){
        try {
          toast.promise( 
            update({id: user.id, body: {name, username, email, bio}}).unwrap(), // Dispatch the signup action
            {
              loading: 'Saving...',
              success: <b>Account updated successfully</b>,
              error: <b>Could not save.</b>,
            }
          );
          dispatch(updateUser({name, username, email, bio}));
          setEditForm(prev => !prev);
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
                      key={'private'}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        marginBottom: 2,
                        padding: "10px 20px",
                        borderRadius: 2,
                        width: '100%',
                      }}
                  >
                    <ListItemText primary={"Private"} />
                    <Switch edge="end" checked={user.account_type === AccountType.PRIVATE}  onChange={handleSwitch}/>
                  </ListItem>
                  <ListItem
                    key={'information'}
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
                    <ListItemText primary={"Personal Information"} />                    
                  </ListItem>
                  {/* Dialog Form */}
                  <Dialog fullWidth open={open} onClose={handleClose}>
                    <DialogTitle>Information</DialogTitle>
                   {/* Wrap everything inside a form */}
                    <form onSubmit={handleFormSubmit}>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='name'
                          label="Name"
                          type="text"
                          defaultValue={user.name}
                          fullWidth
                          disabled={!editForm}
                        />
                      </DialogContent>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='username'
                          label="Username"
                          type="text"
                          defaultValue={user.username}
                          fullWidth
                          disabled={!editForm}
                        />
                      </DialogContent>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='email'
                          label="Email"
                          type="text"
                          defaultValue={user.email}
                          fullWidth
                          disabled={!editForm}
                        />
                      </DialogContent>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          name='bio'
                          label="Bio"
                          type="text"
                          defaultValue={user.bio}
                          fullWidth
                          disabled={!editForm}
                        />
                      </DialogContent>
                      <Alert severity="error" id='signup-error' sx={{ display: 'none' }}></Alert>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        { editForm && <Button color="primary" type="submit">Submit</Button> }
                        { !editForm && <Button onClick={() => setEditForm(!editForm)} color='primary'>Edit</Button> }
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