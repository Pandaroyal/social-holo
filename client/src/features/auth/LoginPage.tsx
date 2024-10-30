import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Divider, Link as MuiLink, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { login, updateStatus } from './authSlice';
import { Status } from "../../utils/constants";
import { showError, toastDisplay } from '../../utils/helper';
import { Alert } from "@mui/material";
import { Spinner } from '../../components/Spinner';

interface LoginFormFields extends HTMLFormControlsCollection {
    email: HTMLSelectElement
    password: HTMLInputElement
}

interface LoginFormElements extends HTMLFormElement {
    readonly elements: LoginFormFields
}

const LoginPage = () => {

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector(state => state.auth)
  const handleLogin = async (e: React.FormEvent<LoginFormElements>) => {
    e.preventDefault()
    console.log("clicked");
    const { elements } = e?.currentTarget
    const email = elements?.email?.value
    const password = elements?.password?.value
    console.log("userId -> ", email, "password -> ", password);
    if (email && password) {
        try {
            await dispatch(login({ email, password })); // Dispatch the login action
        } catch (error) {
            console.error("Login failed:", error); // Handle login failure
            // Optionally display an error message to the user
        }
    } else {
        console.warn("Both fields are required."); // Log if either field is empty
        // Optionally display a warning message to the user
    }
  }

  if(status === Status.loading) <Spinner text={"Loading..."} size={"5"} />
  else if(status === Status.succeeded) {
    console.log("succeeded");
    navigate("/posts")
    dispatch(updateStatus(Status.idle))
  } 
  else if(status === Status.failed) error ? showError(error) : toastDisplay("Login failed");

  return (
    <Container maxWidth="sm" sx={{ height: '80vh', display: "flex", alignItems: 'center' }}>
      <Paper 
        sx={{ padding: 4, borderRadius: 4, boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        component={'form'}
        onSubmit={handleLogin}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          name="email"
          required
          fullWidth
          margin="normal"
          variant="filled" // You can use 'filled' or 'standard' as well
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
          type="password"
          name="password"
          required
          fullWidth
          margin="normal"
          variant="filled" // You can use 'filled' or 'standard' as well
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
          sx={{ marginTop: 2 }}
          type='submit'
          fullWidth
        >
          Login
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
          If don't have an account then go to <MuiLink component={Link} to="/signup">signup</MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
