import React, { useRef, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Divider, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import  $ from 'jquery';
import { Link, useNavigate } from 'react-router-dom';
import { signup, updateStatus } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toastDisplay } from '../../utils/helper';
import { selectAllUsers } from '../users/usersSlice';
import { Spinner } from '../../components/Spinner';
import { showError } from '../../utils/helper';
import { Status } from '../../utils/constants';


interface SignupFormFields extends HTMLFormControlsCollection {
  name: HTMLInputElement
  username: HTMLInputElement
  email: HTMLSelectElement
  password: HTMLInputElement
  confirmPassword: HTMLInputElement
}

interface SignupFormElements extends HTMLFormElement {
  readonly elements: SignupFormFields
}

const SignupPage = () => {

  const theme = useTheme();
  const formRef: any = useRef();
  const navigate = useNavigate();
  const {status, error } = useAppSelector((state) => state.auth);
  const users = useAppSelector(selectAllUsers);
  const dispatch = useAppDispatch();
  console.log(users);
  const handleSignup = async (e: React.FormEvent<SignupFormElements>) => {
    e.preventDefault()
    
    const { elements } = e?.currentTarget
    const name = elements?.name?.value.trim()
    const username = elements?.username?.value.trim()
    const email = elements?.email?.value.trim()
    const password = elements?.password?.value.trim()
    const confirmPassword = elements?.confirmPassword?.value.trim()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/;

    if(email && !emailRegex.test(email)){
      elements.email.focus();
      showError("invalid email");
      return;
    }

    if(password !== confirmPassword){
      elements.password.focus();
      showError("passwords do not match");
      return;
    }
    if(name && username && email && password && confirmPassword){
      try {
        await dispatch(signup({ name, username, email, password })); // Dispatch the signup action
      } catch (error) {
        console.error("Signup failed:", error); // Handle signup failure
        showError("signup failed");
      }
    } else {
      showError("All fields are required."); // Log if any field is empty
      // Optionally display a warning message to the user
    }
  };

  if(status === Status.loading) <Spinner text={"Loading..."} size={"5"} />
  else if(status === Status.succeeded) {
    toastDisplay("Registration Successful");
    navigate("/login");
    formRef?.current && formRef?.current?.reset();
    dispatch(updateStatus(Status.idle))
  } 
  else if(status === Status.failed) error ? showError(error) : toastDisplay("Login failed");



  return (
    <Container maxWidth="sm" sx={{ height: '90vh', display: "flex", alignItems: 'center' }}>
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        width="100%"
        sx={{ padding: 4, borderRadius: 4, boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        component={'form'}
        ref={formRef}
        onSubmit={handleSignup}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>
        <TextField
          label="Name"
          name='name'
          type='text'
          fullWidth
          required
          margin='normal'
          variant="filled" // You can use 'filled' or 'filled' as well
          InputProps={{
            sx: {
              input: {
                paddingLeft: "5px", // Default placeholder color
              },
            },
          }}
        />
        <TextField 
          label="Username"
          name='username'
          type='text'
          fullWidth
          required
          margin='normal'
          variant="filled" // You can use 'filled' or 'filled' as well
          InputProps={{
            sx: {
              input: {
                paddingLeft: "5px", // Default placeholder color
              },
            },
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          margin="normal"
          variant="filled" // You can use 'filled' or 'filled' as well
          InputProps={{
            sx: {
              input: {
                paddingLeft: "5px", // Default placeholder color
              },
            },
          }}
        />
        <TextField
          label="Password"
          name='password'
          type="password"
          fullWidth
          required
          margin="normal"
          variant="filled" // You can use 'filled' or 'filled' as well
          InputProps={{
            sx: {
              input: {
                paddingLeft: "5px", // Default placeholder color
              },
            },
          }}
        />
        <TextField
          label="Confirm Password"
          name='confirmPassword'
          type="password"
          fullWidth
          required
          margin="normal"
          variant="filled" // You can use 'filled' or 'filled' as well
          InputProps={{
            sx: {
              input: {
                paddingLeft: "5px", // Default placeholder color
              },
            },
          }}
        />
        <Alert severity="error" id='signup-error' sx={{ display: 'none' }}></Alert>
        <Button 
          variant="contained" 
          color="primary" 
          type='submit' 
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Signup
        </Button>
        <Divider sx={{ margin: '1rem', 
          '&::before': {
            width: '100%',
            borderTop: `thin solid ${theme.palette.text.primary}`,
            borderTopStyle: 'dashed'
          },
          '&::after': {
            width: '100%',
            borderTop: `thin solid ${theme.palette.text.primary}`,
            borderTopStyle: 'dashed'
          }
        }}>OR</Divider>
        <Typography textAlign='center'>
          If already have an account then go to <MuiLink component={Link} to="/login">login</MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignupPage;
