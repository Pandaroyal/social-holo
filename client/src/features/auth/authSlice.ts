import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../app/withTypes'
import axios, { AxiosError } from 'axios'
import { Status } from '../../utils/constants'
import { ErrorResponse } from 'react-router-dom'
import { AccountType, User } from '../users/usersSlice';
import { aC } from 'vitest/dist/reporters-yx5ZTtEV.js'
import { NotificationsSettings } from '../settings/settingsSlice'

interface AuthState {
    user : User | null
    status: Status
    error: string | null
    redirect: string| null
}

interface LoginData {
    email: string
    password: string
}

interface SignupData {
    name: string
    username: string
    email: string
    password: string
}

export const login = createAppAsyncThunk(
  'auth/login',
  async ({email, password}: LoginData, { rejectWithValue }) => {
    try{
      const {data : {userId}} = await axios.post('http://localhost:8000/auth/signin', {email, password}, { withCredentials: true })
      return userId;
    }catch(err){
      const error = err as AxiosError<ErrorResponse>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Pass the server error to the rejected action
      }
      // For other kinds of errors (network, etc.), pass the error message
      return rejectWithValue(error.message);
    }
})

export const getUser = createAppAsyncThunk(
  'auth/getUser', 
  async () => {
    const response = await axios.get('http://localhost:8000/auth/me', { withCredentials: true })
    return response.data; 
})

export const signup = createAppAsyncThunk(
  'auth/signup', 
  async ({name, username, email, password}: SignupData, { rejectWithValue }) => {
    try{
      const {data : {userId}} = await axios.post('http://localhost:8000/auth/signup', {name, username, email, password }, { withCredentials: true })
      return;
    }catch(err){
      console.log(err);
      const error = err as AxiosError<ErrorResponse>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data); // Pass the server error to the rejected action
      }
      // For other kinds of errors (network, etc.), pass the error message
      return rejectWithValue(error.message);
    }
  }
)
  
export const logout = createAppAsyncThunk(
  'auth/logout', 
  async () => {
    await axios.get('http://localhost:8000/auth/logout', { withCredentials: true })
})

const initialState: AuthState = {
    user: null,
    status: Status.idle,
    error: null,
    redirect: null
}
    
const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      updateStatus: (state, action: PayloadAction<Status>) => {
        state.status = action.payload
      },
      setRedirect: (state, action: PayloadAction<string | null>) => {
        state.redirect = action.payload
      },
      updateUser: (state, action: PayloadAction<{name: string, username: string, email: string, bio: string}>) => {
        if(state.user){
          state.user.name = action.payload.name
          state.user.username = action.payload.username
          state.user.email = action.payload.email
          state.user.bio = action.payload.bio
        }
      },
      changeAccountType: (state, action: PayloadAction<AccountType>) => {
        if(state.user) 
          state.user.account_type = action.payload
      },

      switchNotification: (state, action: PayloadAction<boolean>) => {
        if(state.user) 
          state.user.isNotificationsOn = action.payload
      },

      editNotificationsSettings: (state, action: PayloadAction<NotificationsSettings>) => {
        if(state.user) {
          state.user.follows = action.payload.follows
          state.user.replies = action.payload.replies
          state.user.accepts = action.payload.accepts
          state.user.addPosts = action.payload.addPosts
          state.user.likes = action.payload.likes
          state.user.comments = action.payload.comments
          state.user.replies = action.payload.replies
          state.user.shares = action.payload.shares
        }
      }
    },
    
    extraReducers: builder => {
      // and handle the thunk actions instead
      builder
        .addCase(signup.pending, state => {
          state.status = Status.loading
          state.error = null
        })
        .addCase(signup.fulfilled, state => {
          state.status = Status.succeeded
          state.error = null
        })
        .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
          console.log(action);
          state.status = Status.failed
          state.error = action?.payload?.message
        })
        .addCase(getUser.fulfilled, (state, action) => {
          state.user = action.payload
        })
        .addCase(getUser.rejected, state => {
          state.user = null
        })
        .addCase(login.pending, state => {
          state.status = Status.loading
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.user = action.payload
          state.error = null
        })
        .addCase(login.rejected, (state, action: PayloadAction<any> ) => {
          state.user = null
          state.status = Status.failed
          state.error = action?.payload?.message
        })
        .addCase(logout.fulfilled, state => {
          state.user = null
        })
    },

    selectors: {
      selectCurrentUser: (state) => {
        return state.user
      },

      selectCurrentUserId: (state) => {
        return state.user?.id
      }
    }
})

export const { selectCurrentUser, selectCurrentUserId } = AuthSlice.selectors

export const { updateStatus, setRedirect, changeAccountType, updateUser, switchNotification, editNotificationsSettings } = AuthSlice.actions

export default AuthSlice.reducer